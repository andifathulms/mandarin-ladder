// Content and accuracy rules (CLAUDE.md §6): HSK vocabulary, grammar inventory, characters, pinyin
// against CC-CEDICT, item pinyin, reviewers and sizes. Errors in reviewed lessons, warnings in drafts
// for the vocabulary and grammar rules; alignment and pinyin errors are errors everywhere.
import type { CheckItem, Lesson, Rung } from '../types';
import { charsUpTo, getCedict, getGrammar, getHanzi, getWords, handwritingUpTo, rungLevel, wordsUpTo } from './hsk';
import { getDasarPoints, getDialogue, getHokkien, getNames, getReading, getTestPool } from './load';
import { dialogueZh, itemTexts, lessonZh, readingZh, type ZhText } from './zhTexts';
import { AlignError, alignPinyin, type AlignedWord } from '../zh/align';
import { markSyllable, stripTone, syllables, type Tone } from '../zh/pinyin';
import { spokenTones, writtenTones } from '../zh/sandhi';
import { tableSpelling } from '../zh/syllables';

export type Finding = { level: 'error' | 'warn'; message: string };

/** Grammar detectors (rule 2): a token, read this way, needs one of these grammar points available. */
export const DETECTORS: { zh: string; base: string; needs: string[]; label: string }[] = [
  { zh: '了', base: 'le', needs: ['g1-21', 'g1-22', 'g1-40', 'g1-41'], label: '了 (aspect/change)' },
  { zh: '比', base: 'bi', needs: ['g1-18', 'g1-38', 'g2-58', 'g2-59'], label: '比 (comparison)' },
  { zh: '把', base: 'ba', needs: ['g3-27', 'g3-54', 'g3-09'], label: '把' },
  { zh: '被', base: 'bei', needs: ['g3-27', 'g3-55'], label: '被 (passive)' },
  { zh: '得', base: 'de', needs: ['g2-31', 'g2-51', 'g3-48', 'g3-49'], label: '得 (complement)' },
  { zh: '过', base: 'guo', needs: ['g2-32', 'g2-71'], label: '过 (experience)' },
  { zh: '着', base: 'zhe', needs: ['g2-33', 'g2-70'], label: '着 (continuous)' },
];

const NUMERAL = /^[零〇一二三四五六七八九十百千万两]+$/u;

/** Readings a word may have (CC-CEDICT, the HSK list, names), as syllable lists. */
function dictReadings(zh: string): string[][] {
  const out: string[][] = [];
  const add = (py: string) => {
    const s = syllables(py.replace(/\s+/g, ''));
    if (s) out.push(s.map((x) => x.text));
  };
  for (const [, py] of getCedict()[zh] ?? []) add(py);
  for (const w of getWords()) if (w.zh === zh) add(w.py);
  for (const n of getNames()) if (n.zh === zh) add(n.py);
  return out;
}

const base = (syl: string) => tableSpelling(stripTone(syl));
const tone = (syl: string): Tone => (syllables(syl)?.[0]?.tone ?? 0) as Tone;

/** True when an authored syllable matches a dictionary syllable (rule 4): same base, same tone or neutral on either side. */
function sylMatches(authored: string, dict: string, ch: string): boolean {
  if (base(authored) !== base(dict)) return authored === 'r' && ch === '儿';
  const a = tone(authored);
  const d = tone(dict);
  if (a === d || a === 0 || d === 0) return true;
  // 一 and 不 are authored with their spoken tones.
  if (ch === '一') return [1, 2, 4].includes(a);
  if (ch === '不') return [2, 4].includes(a);
  return false;
}

/** Pinyin problems of one aligned word: dictionary reading, tone-mark placement, authored sandhi. */
export function pinyinProblems(w: AlignedWord, next?: AlignedWord): string[] {
  const out: string[] = [];
  if (w.kind !== 'han') return out;
  for (const c of w.chars) {
    const s = c.syl;
    if (s.erhua) continue;
    const want = markSyllable(s.base, s.tone);
    if (s.text.toLowerCase().normalize('NFC') !== want.normalize('NFC') && s.text.replace(/[0-5]$/, '').toLowerCase() !== want) {
      out.push(`${w.text}: tone mark misplaced in "${s.text}" (write ${want})`);
    }
  }
  const authored = w.chars.map((c) => c.syl.text);
  const whole = dictReadings(w.text).filter((r) => r.length === authored.length);
  const okWhole = whole.some((r) => r.every((d, i) => sylMatches(authored[i], d, w.chars[i].ch)));
  if (okWhole) return out;
  // No dictionary entry for the word as a whole (or none that fits): check character by character.
  if (!whole.length && w.chars.every((c) => dictReadings(c.ch).some((r) => r.length === 1 && sylMatches(c.syl.text, r[0], c.ch)))) return out;
  if (NUMERAL.test(w.text)) return out;
  const known = whole.map((r) => r.join('')).join(' / ') || w.chars.map((c) => dictReadings(c.ch).map((r) => r.join('')).join('|')).join(' + ');
  // Authored 3+3 sandhi: a second tone where the dictionary has a third before another third.
  const sandhi = whole.some((r) =>
    r.some((d, i) => tone(d) === 3 && tone(authored[i]) === 2 && (tone(r[i + 1] ?? '') === 3 || (i === r.length - 1 && next?.chars[0] && next.chars[0].syl.tone === 3))),
  );
  out.push(
    sandhi
      ? `${w.text}: "${w.py}" writes the spoken 3+3 change; author citation tones (${known}) and let the app compute sandhi`
      : `${w.text}: "${w.py}" does not match CC-CEDICT (${known || 'no entry'})`,
  );
  return out;
}

function alignAll(t: ZhText): AlignedWord[] | string {
  if (!t.py) return 'no pinyin';
  try {
    return alignPinyin(t.zh, t.py);
  } catch (e) {
    return (e as AlignError).message;
  }
}

type Ctx = {
  where: string;
  level: Finding['level'];
  known: (zh: string) => boolean;
  available: Set<string>;
  findings: Finding[];
};

/** Alignment, pinyin, vocabulary and grammar detectors over a set of texts. */
function lintTexts(texts: ZhText[], ctx: Ctx, opts: { vocab: boolean; grammar: boolean }) {
  const unknown = new Set<string>();
  for (const t of texts) {
    const a = alignAll(t);
    if (typeof a === 'string') {
      ctx.findings.push({ level: 'error', message: `${ctx.where}: ${t.where}: ${a}` });
      continue;
    }
    a.forEach((w, i) => {
      for (const p of pinyinProblems(w, a[i + 1])) ctx.findings.push({ level: 'error', message: `${ctx.where}: ${t.where}: ${p}` });
      if (t.off || w.kind !== 'han') return;
      if (opts.vocab && !ctx.known(w.text)) unknown.add(w.text);
      if (opts.grammar) {
        for (const d of DETECTORS) {
          if (w.text === d.zh && w.chars.length === 1 && base(w.chars[0].syl.text) === d.base && !d.needs.some((g) => ctx.available.has(g))) {
            ctx.findings.push({ level: ctx.level, message: `${ctx.where}: ${t.where}: ${d.label} before its grammar point (${d.needs.join(' / ')})` });
          }
        }
      }
    });
  }
  if (unknown.size) {
    ctx.findings.push({ level: ctx.level, message: `${ctx.where}: words not on the HSK list for this rung (or names, or extra): ${[...unknown].join('、')}` });
  }
}

/** Tone items: the answer must be the written or spoken tones of the audio (CLAUDE.md §5.3, §7.3). */
function lintToneItems(items: CheckItem[], where: string, findings: Finding[]) {
  for (const c of items) {
    if (c.type !== 'tone' || !c.audio_py) continue;
    try {
      const a = alignPinyin(c.audio, c.audio_py);
      const want = c.ask === 'spoken' ? spokenTones(a) : writtenTones(a);
      if (want.join(',') !== c.answer.join(',')) {
        findings.push({ level: 'error', message: `${where}: ${c.id}: answer ${c.answer.join('+')} but the ${c.ask} tones of ${c.audio} are ${want.join('+')}` });
      }
    } catch (e) {
      findings.push({ level: 'error', message: `${where}: ${c.id}: audio_py: ${(e as Error).message}` });
    }
  }
}

export function lintLessons(rungs: Rung[], byRung: Map<string, Lesson[]>): Finding[] {
  const findings: Finding[] = [];
  const names = new Set(getNames().map((n) => n.zh));
  const grammarIds = new Set(getGrammar().map((g) => g.id));
  const dasarIds = new Set(getDasarPoints().map((d) => d.id));
  const hokkien = getHokkien();
  const hanzi = getHanzi();
  const available = new Set<string>();

  for (const rung of rungs) {
    const lessons = byRung.get(rung.id) ?? [];
    const lvl = rungLevel(rung);
    const words = wordsUpTo(lvl);
    const chars = charsUpTo(lvl);
    const handwriting = handwritingUpTo(lvl);
    const rungExtra = new Set<string>();

    for (const id of rung.inventory) {
      if (!grammarIds.has(id) && !dasarIds.has(id)) findings.push({ level: 'error', message: `curriculum.yaml: ${rung.id}: inventory "${id}" is not a grammar or Dasar point` });
    }

    for (const l of lessons) {
      const level: Finding['level'] = l.status === 'reviewed' ? 'error' : 'warn';
      const where = `${rung.id}/${l.slug}`;
      l.introduces.forEach((g) => available.add(g));
      for (const e of l.extra ?? []) rungExtra.add(e.zh);
      const known = (zh: string) => words.has(zh) || names.has(zh) || rungExtra.has(zh) || NUMERAL.test(zh);

      // Rules 1, 2 and 4.
      lintTexts(lessonZh(l), { where, level, known, available, findings }, { vocab: true, grammar: true });
      lintToneItems(l.check, where, findings);

      // Glossary words themselves must be listed words (rule 1), and their HSK level right.
      for (const g of l.glossary) {
        const hits = words.get(g.zh);
        if (!hits && !names.has(g.zh) && !rungExtra.has(g.zh)) continue; // reported as an unknown word above
        if (g.hsk && hits && !hits.some((h) => h.hsk === g.hsk)) findings.push({ level, message: `${where}: glossary ${g.zh} is HSK ${hits.map((h) => h.hsk).join('/')}, not ${g.hsk}` });
      }

      // Rule 3: characters and handwriting.
      for (const c of l.hanzi ?? []) {
        if (!chars.has(c)) findings.push({ level, message: `${where}: hanzi ${c} is not an HSK ${lvl} (or lower) character` });
        if (!hanzi[c]) findings.push({ level: 'error', message: `${where}: hanzi ${c} has no Make Me a Hanzi data` });
      }
      for (const c of l.check) {
        if (c.type === 'trace' && !handwriting.has(c.char)) findings.push({ level, message: `${where}: ${c.id}: ${c.char} is not on the handwriting list for this rung or below` });
        if ((c.type === 'trace' || c.type === 'build') && !hanzi[c.char]) findings.push({ level: 'error', message: `${where}: ${c.id}: no stroke data for ${c.char}` });
      }

      // Rule 7: Hokkien bridges come from hokkien.yaml.
      for (const h of l.hokkien ?? []) {
        const e = hokkien.find((x) => x.id_word === h);
        if (!e) findings.push({ level: 'error', message: `${where}: hokkien "${h}" is not in content/data/hokkien.yaml` });
        else if (!e.reviewed_by) findings.push({ level, message: `${where}: hokkien "${h}" has no reviewer for its Hokkien form` });
      }

      // Rule 9: reviewer fields.
      if (l.status === 'reviewed' && (!l.review?.by || !l.review?.date)) findings.push({ level: 'error', message: `${where}: reviewed lessons need review.by and review.date` });

      // Rule 10: sizes (the Dasar rungs teach sounds and strokes, with few words).
      if (rung.tier !== 'dasar') {
        if (l.glossary.length < 8) findings.push({ level, message: `${where}: ${l.glossary.length} glossary words; lessons carry 8–16` });
        const n = l.hanzi?.length ?? 0;
        if (n < 6) findings.push({ level, message: `${where}: ${n} new characters in hanzi; lessons introduce 6–12` });
      }
      for (const g of l.introduces) {
        if (!rung.inventory.includes(g)) findings.push({ level: 'error', message: `${where}: introduces "${g}", which is not in ${rung.id}'s inventory` });
      }
    }

    // Test pool, reading, dialogue: the whole rung's words and grammar.
    const knownRung = (zh: string) => words.has(zh) || names.has(zh) || rungExtra.has(zh) || NUMERAL.test(zh);
    const pool = getTestPool(rung.id);
    if (pool) {
      const texts = pool.items.flatMap((c) => itemTexts(c));
      lintTexts(texts, { where: `${rung.id}/test.yaml`, level: 'warn', known: knownRung, available, findings }, { vocab: true, grammar: true });
      lintToneItems(pool.items, `${rung.id}/test.yaml`, findings);
      for (const c of pool.items) {
        if (c.type === 'trace' && !handwriting.has(c.char)) findings.push({ level: 'warn', message: `${rung.id}/test.yaml: ${c.id}: ${c.char} is not on the handwriting list` });
      }
    }
    let reading = null;
    let dialogue = null;
    try {
      reading = getReading(rung.id);
      dialogue = getDialogue(rung.id);
    } catch {
      // schema errors are reported by content-check
    }
    if (reading) {
      const own = new Set(reading.glossary.map((g) => g.zh));
      lintTexts(readingZh(reading), { where: `${rung.id}/reading.yaml`, level: 'warn', known: (z) => knownRung(z) || own.has(z), available, findings }, { vocab: true, grammar: true });
    }
    if (dialogue) {
      lintTexts(dialogueZh(dialogue), { where: `${rung.id}/dialogue.yaml`, level: 'warn', known: knownRung, available, findings }, { vocab: true, grammar: true });
    }

    // Grammar from this rung is available to later rungs in full.
    rung.inventory.forEach((g) => available.add(g));
  }
  return findings;
}

