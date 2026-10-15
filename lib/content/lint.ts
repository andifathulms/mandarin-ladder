import type { Lesson, Letter, LexiconEntry, Rung } from '../types';
import { DAGGER_ALIF, SHADDA, SUKUN, TANWIN, isArabicLetter, isHarakah, isMark } from '../arabic/chars';
import { looseKey, tokenise } from '../arabic/text';
import { type ArText, dialogueArabic, itemArabic, lessonArabic, readingArabic } from './arabicTexts';
import { getDialogue, getLetters, getLexicon, getReading, getTestPool } from './load';

export type Finding = { level: 'error' | 'warn'; message: string };

const VERBLESS_RUNGS = new Set(['huruf-1', 'huruf-2', 'easy-1']);
/** Case-ending terms may not appear in explanations before Medium 3 (CLAUDE.md §8.2). */
const CASE_TERMS = /\b(marfu['ʿ]?|marfūʿ|manshub|manṣūb|mansub|majrur|majrūr|i['ʿ]rab|iʿrāb|irab)\b/i;
const CASE_TERMS_FROM = 'medium-3';

// ---------- lexicon (rule 4) ----------

const PREFIXES = ['وال', 'فال', 'بال', 'كال', 'لل', 'ال', 'و', 'ف', 'ب', 'ل', 'ك'];
const SUFFIXES = ['كما', 'كم', 'كن', 'هم', 'هن', 'هما', 'ها', 'نا', 'ني', 'ي', 'ك', 'ه'];

/** Candidate dictionary forms of a word after clitic stripping (all as looseKey). */
export function candidates(word: string): string[] {
  const k = looseKey(word);
  const out = new Set<string>([k]);
  const stems = new Set<string>([k]);
  for (const p of PREFIXES) if (k.startsWith(p) && k.length - p.length >= 2) stems.add(k.slice(p.length));
  for (const s of [...stems]) {
    out.add(s);
    for (const suf of SUFFIXES) {
      if (s.endsWith(suf) && s.length - suf.length >= 2) {
        const base = s.slice(0, -suf.length);
        out.add(base);
        // ta marbuta returns before a suffix: مدرستي → مدرسة
        if (base.endsWith('ت')) out.add(base.slice(0, -1) + 'ه');
        // ى becomes ا before a suffix: عصاه; and the long ā of أبو/أخو
        if (base.endsWith('ا')) out.add(base.slice(0, -1) + 'ي');
      }
    }
  }
  return [...out];
}

function knownSet(entries: string[]): Set<string> {
  return new Set(entries.map(looseKey));
}

function unknownWords(texts: ArText[], known: Set<string>): string[] {
  const unknown = new Set<string>();
  for (const t of texts) {
    if (t.eg || t.displayOnly) continue;
    for (const w of tokenise(t.ar)) {
      if (!/[ء-ي]/.test(w.text)) continue;
      if (!candidates(w.text).some((c) => known.has(c))) unknown.add(w.text);
    }
  }
  return [...unknown];
}

// ---------- harakat completeness (rule 5) ----------

type Unit = { ch: string; marks: string };
const unitsOf = (w: string): Unit[] => {
  const out: Unit[] = [];
  for (const ch of w.normalize('NFC')) {
    if (isMark(ch) && out.length) out[out.length - 1].marks += ch;
    else out.push({ ch, marks: '' });
  }
  return out;
};
const vowelled = (m: string) => [...m].some((c) => isHarakah(c) && c !== SHADDA) || m.includes(DAGGER_ALIF);

/**
 * Letters missing a vowel, sukun or shaddah+vowel. Allowed bare: long-vowel letters (ا ى, and و ي after
 * their matching vowel), the lam of al-, hamzat wasl, and the last letter of a word before a pause.
 */
export function missingHarakat(text: string): string[] {
  const problems: string[] = [];
  const words = tokenise(text);
  words.forEach((tok, wi) => {
    const u = unitsOf(tok.text);
    const after = text.slice(tok.end).match(/^[\s]*([.,!?;:،؛؟]|$)/);
    const pausal = !!after || wi === words.length - 1;
    const hasArticle = (k: number) => (u[k]?.ch === 'ا' || u[k]?.ch === 'ٱ') && u[k + 1]?.ch === 'ل' && u.length > k + 2;
    const art = hasArticle(0) ? 0 : 'وفبك'.includes(u[0]?.ch) && hasArticle(1) ? 1 : -1;
    u.forEach((x, i) => {
      if (!isArabicLetter(x.ch)) return;
      if (vowelled(x.marks) || x.marks.includes(SUKUN)) return;
      if ('اىآ'.includes(x.ch)) return;
      if (x.ch === 'ٱ') return;
      if (art >= 0 && (i === art || i === art + 1)) return; // hamzat wasl and the lam of al-
      if (i === 0 && x.ch === 'ا') return; // hamzat wasl
      if ((x.ch === 'و' || x.ch === 'ي') && i > 0) {
        const prev = u[i - 1].marks;
        if ((x.ch === 'و' && prev.includes('ُ')) || (x.ch === 'ي' && prev.includes('ِ'))) return;
      }
      if (x.ch === 'و' && i === u.length - 1 && u[i - 1]?.marks.includes('ُ')) return;
      if (pausal && i === u.length - 1) return;
      if (pausal && i === u.length - 2 && u[u.length - 1].ch === 'ا' && [...TANWIN].some((t) => x.marks.includes(t))) return;
      problems.push(`${tok.text} (${x.ch})`);
    });
  });
  return problems;
}

// ---------- Huruf 1 script inventory (rule 3) ----------

const LONG_OR_STOP = (u: Unit[], i: number) => {
  const x = u[i];
  if (x.marks.includes(SUKUN) || x.marks.includes(SHADDA) || [...TANWIN].some((t) => x.marks.includes(t))) return true;
  // a vowel letter carrying no vowel of its own is a long vowel (mad)
  if ('اوىي'.includes(x.ch) && !vowelled(x.marks) && i > 0) return true;
  return false;
};

export function hurufOneProblems(text: string, allowed: Set<string>): string[] {
  const out: string[] = [];
  for (const tok of tokenise(text)) {
    const u = unitsOf(tok.text);
    u.forEach((x, i) => {
      if (!isArabicLetter(x.ch)) return;
      const base = 'أإآ'.includes(x.ch) ? 'ا' : x.ch;
      if (!allowed.has(base) && !allowed.has(x.ch)) out.push(`${tok.text}: letter ${x.ch} not taught yet`);
      if (LONG_OR_STOP(u, i)) out.push(`${tok.text}: ${x.ch} uses mad, sukun, syaddah or tanwin (Huruf 2)`);
    });
  }
  return out;
}

// ---------- main ----------

const isVerb = (pos?: string) => pos === 'verb';

export function lintLessons(rungs: Rung[], byRung: Map<string, Lesson[]>): Finding[] {
  const findings: Finding[] = [];
  const lexicon: LexiconEntry[] = getLexicon();
  const letters: Letter[] = getLetters();
  const earlierWords: string[] = [];
  const caseFrom = rungs.findIndex((r) => r.id === CASE_TERMS_FROM);

  for (const [ri, rung] of rungs.entries()) {
    const lessons = byRung.get(rung.id) ?? [];
    const rungLex = lexicon.filter((e) => e.rung === rung.id);
    const glossSoFar: string[] = [];
    const exactRung = rung.tier === 'huruf';

    // Rule 2: no verbs before Easy 2 (chunks allowed).
    if (VERBLESS_RUNGS.has(rung.id)) {
      for (const e of rungLex) if (isVerb(e.pos)) findings.push({ level: 'error', message: `lexicon/core.yaml: ${e.ar} is a verb in ${rung.name} (no verbs before Easy 2; use pos: chunk for fixed phrases)` });
    }

    for (const l of lessons) {
      const level: Finding['level'] = l.status === 'reviewed' ? 'error' : 'warn';
      const where = `${rung.id}/${l.slug}`;
      l.glossary.forEach((g) => glossSoFar.push(g.ar));
      const texts = lessonArabic(l);

      if (VERBLESS_RUNGS.has(rung.id)) {
        for (const g of l.glossary) if (isVerb(g.pos)) findings.push({ level: 'error', message: `${where}: glossary ${g.ar} is a verb (no verbs before Easy 2)` });
      }

      // Case-ending terms before Medium 3.
      if (caseFrom < 0 || ri < caseFrom) {
        for (const [k, b] of [['concept', l.concept], ['contrast', l.contrast]] as const) {
          for (const lang of ['id', 'en'] as const) {
            const m = b[lang].match(CASE_TERMS);
            if (m) findings.push({ level, message: `${where}: ${k}.${lang} names "${m[0]}" before Medium 3; point endings out as patterns instead` });
          }
        }
      }

      // Rule 3: Huruf 1 uses only letters taught so far, with short vowels only.
      if (rung.id === 'huruf-1' && letters.length) {
        const allowed = new Set(letters.filter((x) => x.lesson <= l.order).map((x) => x.letter));
        for (const t of texts) {
          if (t.displayOnly || t.where.startsWith('pair.off')) continue;
          for (const p of hurufOneProblems(t.ar, allowed)) findings.push({ level, message: `${where}: ${t.where}: ${p}` });
        }
      }
      if (!(rung.id === 'huruf-1' && l.order === 1)) {
        for (const e of [...l.examples, ...l.glossary]) {
          if (e.display_only) findings.push({ level: 'error', message: `${where}: display_only is allowed in Huruf 1 lesson 1 only` });
        }
      }

      // Exact matching in Huruf rungs and for every mark item.
      for (const c of l.check) {
        if ((exactRung || c.type === 'mark') && c.match !== 'exact') {
          findings.push({ level: 'error', message: `${where}: ${c.id}: ${exactRung ? 'Huruf items' : 'mark items'} need match: exact` });
        }
      }

      // Rule 4: lexicon.
      const known = knownSet([...earlierWords, ...rungLex.map((e) => e.ar), ...glossSoFar]);
      const unknown = unknownWords(texts, known);
      if (unknown.length && rung.tier !== 'huruf') {
        findings.push({ level, message: `${where}: words not in the lexicon or glossaries so far: ${unknown.join('، ')}` });
      }

      // Rule 5: harakat completeness (Fusha only).
      for (const t of texts) {
        if (t.eg || t.displayOnly) continue;
        if (/^[ء-ي]$/.test(t.ar)) continue; // a bare letter shown as a letter
        const miss = missingHarakat(t.ar);
        if (miss.length) findings.push({ level, message: `${where}: ${t.where}: missing harakat on ${miss.join(', ')}` });
      }

      // Rule 10: reviewer fields.
      const hasEg = l.examples.some((e) => e.eg) || l.talk?.variety === 'eg' || l.glossary.some((g) => g.eg);
      if (l.status === 'reviewed') {
        if (!l.review?.by || !l.review?.date) findings.push({ level: 'error', message: `${where}: reviewed lessons need review.by and review.date` });
        if (hasEg && !l.review?.eg_by) findings.push({ level: 'error', message: `${where}: lessons with Egyptian lines need review.eg_by` });
      }
    }

    // Test pool: exact in Huruf, lexicon over the whole rung.
    const pool = getTestPool(rung.id);
    if (pool) {
      for (const c of pool.items) {
        if ((exactRung || c.type === 'mark') && c.match !== 'exact') findings.push({ level: 'error', message: `${rung.id}/test.yaml: ${c.id}: needs match: exact` });
      }
      if (rung.tier !== 'huruf') {
        const known = knownSet([...earlierWords, ...rungLex.map((e) => e.ar), ...glossSoFar]);
        const texts = pool.items.flatMap((c) => itemArabic(c).map((ar) => ({ where: c.id, ar, eg: c.type === 'listen' && c.variety === 'eg' })));
        const unknown = unknownWords(texts, known);
        if (unknown.length) findings.push({ level: 'warn', message: `${rung.id}/test.yaml: words not in the lexicon or glossaries: ${unknown.join('، ')}` });
      }
    }

    // Reading and dialogue: the rung's whole lexicon plus their own glossary.
    let reading = null;
    let dialogue = null;
    try {
      reading = getReading(rung.id);
      dialogue = getDialogue(rung.id);
    } catch {
      // schema errors are reported by content-check
    }
    const capstones: [string, ArText[], string[]][] = [];
    if (reading) capstones.push(['reading.yaml', readingArabic(reading), reading.glossary.map((g) => g.ar)]);
    if (dialogue) capstones.push(['dialogue.yaml', dialogueArabic(dialogue), []]);
    for (const [file, texts, own] of capstones) {
      const known = knownSet([...earlierWords, ...rungLex.map((e) => e.ar), ...glossSoFar, ...own]);
      const unknown = unknownWords(texts, known);
      if (unknown.length && rung.tier !== 'huruf') findings.push({ level: 'warn', message: `${rung.id}/${file}: words not in the lexicon or glossaries: ${unknown.join('، ')}` });
      for (const t of texts) {
        if (t.eg) continue;
        const miss = missingHarakat(t.ar);
        if (miss.length) findings.push({ level: 'warn', message: `${rung.id}/${file}: ${t.where}: missing harakat on ${miss.join(', ')}` });
      }
    }

    // words_target ±20%
    const live = rung.status === 'live';
    if (live && rung.words_target > 0) {
      const n = new Set(lessons.flatMap((l) => l.glossary.filter((g) => !g.display_only).map((g) => looseKey(g.ar)))).size;
      if (n < rung.words_target * 0.8 || n > rung.words_target * 1.2) {
        findings.push({ level: 'warn', message: `${rung.id}: ${n} new glossary words; target ${rung.words_target} ±20%` });
      }
    }

    earlierWords.push(...rungLex.map((e) => e.ar), ...glossSoFar);
  }
  return findings;
}
