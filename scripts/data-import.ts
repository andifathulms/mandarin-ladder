/*
 * (Re)builds content/data from the vendor sources in ./vendor (npm run data:fetch first).
 * Rarely run; its output is committed. Writes:
 *   content/data/hsk/words.yaml       every HSK 3.0 word, per level, with pinyin, gloss, measure words
 *   content/data/hsk/chars.yaml       the characters of each level
 *   content/data/hsk/handwriting.yaml the handwriting characters per band
 *   content/data/hsk/grammar.yaml     the grammar points per level
 *   content/data/cedict.json          CC-CEDICT readings and traditional forms for the words we may meet
 *   content/data/hanzi.json           Make Me a Hanzi decomposition, radical and etymology per character
 *   content/data/syllables.yaml       every syllable with the tones that exist (audio keys added by audio:syllables)
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import yaml from 'js-yaml';
import { LEVELS, VENDOR } from './data-fetch';
import { markSyllable, stripTone, syllables, type Tone } from '../lib/zh/pinyin';
import { hanCount } from '../lib/zh/text';
import { isValidSyllable, SYLLABLE_BASES, syllableParts, tableSpelling } from '../lib/zh/syllables';
import { wordId } from '../lib/zh/ids';

const OUT = path.join(process.cwd(), 'content', 'data');
const read = (rel: string) => fs.readFileSync(path.join(VENDOR, rel), 'utf8').replace(/^\uFEFF/, '');
const lines = (rel: string) =>
  read(rel)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

// ---------- CC-CEDICT ----------

type CedictEntry = { trad: string; simp: string; py: string; defs: string[] };

function loadCedict(): { entries: CedictEntry[]; date: string } {
  const text = zlib.gunzipSync(fs.readFileSync(path.join(VENDOR, 'cedict', 'cedict.txt.gz'))).toString('utf8');
  const entries: CedictEntry[] = [];
  let date = '';
  for (const line of text.split('\n')) {
    if (line.startsWith('#! date=')) date = line.slice(8).trim();
    if (!line || line.startsWith('#')) continue;
    const m = /^(\S+) (\S+) \[([^\]]*)\] \/(.*)\/\s*$/.exec(line);
    if (!m) continue;
    entries.push({ trad: m[1], simp: m[2], py: m[3], defs: m[4].split('/') });
  }
  return { entries, date };
}

/** CEDICT numeric pinyin ("Bei3 jing1", "xie4 xie5") → orthographic marks ("Běijīng", "xièxie"). */
export function cedictToMarks(py: string): string | null {
  const parts = py.replace(/u:/g, 'ü').split(/\s+/);
  let out = '';
  for (let k = 0; k < parts.length; k++) {
    const p = parts[k];
    if (p === ',' || p === '·') return null;
    const m = /^([A-Za-zÜü]+)([1-5])$/.exec(p);
    if (!m) return null;
    const base = m[1];
    const tone = (Number(m[2]) % 5) as Tone;
    // CEDICT writes erhua as a separate "r5".
    if (base.toLowerCase() === 'r' && k > 0) {
      out += 'r';
      continue;
    }
    if (!syllables(base.toLowerCase())) return null;
    const marked = markSyllable(base, tone);
    if (k > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(marked)) out += "'";
    out += marked;
  }
  return out;
}

// ---------- apostrophe repair ----------

const MARKED_VOWEL = /^[aoeāáǎàōóǒòēéěè]/i;

/** Every way to cut a toneless-checkable pinyin run into valid syllables (with a final erhua r). */
function allSplits(run: string, limit = 50): string[][] {
  const out: string[][] = [];
  const go = (i: number, acc: string[]) => {
    if (out.length >= limit) return;
    if (i === run.length) {
      out.push(acc);
      return;
    }
    for (let len = Math.min(6, run.length - i); len >= 1; len--) {
      const piece = run.slice(i, i + len);
      const base = stripTone(piece).toLowerCase();
      const erhua = base === 'r' && i > 0 && i + len === run.length;
      if (erhua || isValidSyllable(base)) go(i + len, [...acc, piece]);
    }
  };
  go(0, []);
  return out;
}

/**
 * Restores the apostrophes the transcription leaves out (kěài → kě'ài, ǒuěr → ǒu'ěr) by choosing
 * the split whose syllable count equals the number of characters. Spaces and hyphens are kept.
 */
export function repairApostrophes(py: string, hanCount: number): string {
  const clean = py.replace(/…/g, '').replace(/\s+/g, ' ').trim();
  const parts = clean.split(/([ -])/);
  const runs = parts.filter((_, k) => k % 2 === 0).map((r) => r.replace(/'/g, ''));
  const options = runs.map((r) => allSplits(r));
  if (options.some((o) => !o.length)) return clean;
  // Pick one split per run so the total matches; prefer fewer syllables in ties (xian over xi'an).
  let best: string[][] | null = null;
  const pick = (k: number, acc: string[][], n: number) => {
    if (best) return;
    if (k === options.length) {
      if (n === hanCount) best = acc;
      return;
    }
    for (const o of [...options[k]].sort((x, y) => x.length - y.length)) pick(k + 1, [...acc, o], n + o.length);
  };
  pick(0, [], 0);
  if (!best) return clean;
  const chosen: string[][] = best;
  return parts
    .map((p, k) =>
      k % 2 === 1 ? p : chosen[k / 2].map((syl, j) => (j > 0 && MARKED_VOWEL.test(syl) ? `'${syl}` : syl)).join(''),
    )
    .join('');
}

// ---------- complete-hsk-vocabulary (CKV) ----------

type CkvForm = { traditional: string; transcriptions: { pinyin: string }; meanings: string[]; classifiers: string[] };
type CkvWord = { simplified: string; forms: CkvForm[] };

/** CKV pinyin "ài hào" → "àihào"; keeps apostrophes needed before a/o/e syllables. */
function ckvToMarks(py: string): string {
  const parts = py.split(/\s+/);
  return parts
    .map((p, k) => (k > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(p) ? `'${p}` : p))
    .join('');
}

// ---------- words ----------

const VARIANT = /^(variant of|old variant|erhua variant|see |used in|surname |\(Tw\)|\(old\)|abbr\.|Japanese variant)/i;
const realSenses = (defs: string[]) => defs.filter((d) => !VARIANT.test(d) && !d.startsWith('CL:')).length;

/** Measure words from a CEDICT "CL:個|个[ge4],位[wei4]" sense, simplified. */
function classifiers(defs: string[]): string[] {
  const cl = defs.find((d) => d.startsWith('CL:'));
  if (!cl) return [];
  return cl
    .slice(3)
    .split(',')
    .map((x) => x.replace(/\[.*?\]/, ''))
    .map((x) => (x.includes('|') ? x.split('|')[1] : x).trim())
    .filter(Boolean);
}

export type WordEntry = { id: string; zh: string; py: string; hsk: string; en: string; mw?: string[]; trad?: string; sense?: number };

/** Up to three short English senses, about 50 characters: a hint for authors, not shown to learners. */
const shortGloss = (defs: string[]) => {
  const keep: string[] = [];
  for (const d of defs.flatMap((x) => x.split(/;\s*/))) {
    if (d.startsWith('CL:') || VARIANT.test(d)) continue;
    const t = d.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (!t || keep.includes(t)) continue;
    if (keep.length && keep.join('; ').length + t.length > 50) break;
    keep.push(t);
    if (keep.length >= 3) break;
  }
  return keep.join('; ');
};

type Correction =
  | { op: 'replace'; hsk: string; from: string; to: string; reason: string }
  | { op: 'pinyin'; hsk: string; zh: string; py: string; reason: string }
  | { op: 'homograph'; hsk: string; zh: string; py: string; sense: number; en: string; reason: string }
  | { op: 'char'; hsk: string; from: string; to: string; reason: string };
const corrections = (): Correction[] =>
  (yaml.load(fs.readFileSync(path.join(OUT, 'hsk', 'corrections.yaml'), 'utf8')) as Correction[]) ?? [];

function importWords(cedictBySimp: Map<string, CedictEntry[]>) {
  const all: WordEntry[] = [];
  const problems: string[] = [];
  const fixes = corrections();
  LEVELS.forEach((level, li) => {
    const words = lines(`hsk/words-${level}.txt`).map(
      (w) => fixes.find((f): f is Extract<Correction, { op: 'replace' }> => f.op === 'replace' && f.hsk === level && f.from === w)?.to ?? w,
    );
    const meaning = new Map<string, { py: string; trad: string; en: string }>();
    for (const row of lines(`hsk/meaning-${level}.tsv`)) {
      const [trad, simp, py, en] = row.split('\t');
      // The transcription writes erhua with a neutral-tone digit: nàhuìr5 → nàhuìr.
      if (!meaning.has(simp)) meaning.set(simp, { py: py.trim().replace(/r5\b/g, 'r').replace(/\s+/g, ' '), trad, en: en ?? '' });
    }
    const ckv = new Map<string, CkvWord>();
    for (const w of JSON.parse(read(`ckv/new-${li + 1}.json`)) as CkvWord[]) ckv.set(w.simplified, w);
    const seen = new Map<string, string[]>();
    for (const zh of words) {
      const used = seen.get(zh) ?? [];
      const forms = (ckv.get(zh)?.forms ?? []).filter((f) => !/^[A-Z]/.test(f.transcriptions.pinyin) || /^[A-Z]/.test(zh));
      const fromCkv = forms.map((f) => ckvToMarks(f.transcriptions.pinyin));
      const fromCedict = (cedictBySimp.get(zh) ?? [])
        .filter((e) => !/^[A-Z]/.test(e.py))
        .map((e) => cedictToMarks(e.py))
        .filter((p): p is string => !!p);
      const m = meaning.get(zh);
      // The meaning list's pinyin first (one per distinct word), then CKV, then CEDICT readings.
      const candidates = [...(m ? [m.py] : []), ...fromCkv, ...fromCedict].filter((p, i, a) => p && a.indexOf(p) === i);
      const fixedPy = fixes.find((f) => f.op === 'pinyin' && f.hsk === level && f.zh === zh) as { py: string } | undefined;
      const picked = fixedPy?.py ?? candidates.find((p) => !used.includes(p)) ?? candidates[0];
      const py = picked && repairApostrophes(picked, hanCount(zh));
      if (!py) {
        problems.push(`no pinyin for ${zh} (HSK ${level})`);
        continue;
      }
      if (/\d/.test(py)) problems.push(`digit in pinyin for ${zh} (HSK ${level}): ${py}`);
      // The same word and reading listed twice (批 verb, 批 measure word) is two senses.
      const sense = used.filter((u) => u === py).length + 1;
      used.push(py);
      seen.set(zh, used);
      // Gloss, traditional form and measure words come from the main CC-CEDICT entry for this exact
      // reading: the one with the most real senses (variant-of entries count for nothing).
      const ced = (cedictBySimp.get(zh) ?? [])
        .filter((e) => cedictToMarks(e.py)?.toLowerCase() === py.toLowerCase())
        .sort((x, y) => realSenses(y.defs) - realSenses(x.defs))[0];
      const form = forms.find((f) => ckvToMarks(f.transcriptions.pinyin) === py);
      const en = (ced ? shortGloss(ced.defs) : '') || (form ? shortGloss(form.meanings) : '') || shortGloss((m?.en ?? '').split(/,\s*/));
      const trad = ced?.trad ?? form?.traditional;
      const cl = ced ? classifiers(ced.defs) : [];
      const mw = cl.length ? cl.slice(0, 2) : form?.classifiers?.length ? form.classifiers.slice(0, 2) : undefined;
      const entry: WordEntry = { id: wordId(level, zh, py, sense), zh, py, hsk: level, en, ...(sense > 1 ? { sense } : {}) };
      if (mw) entry.mw = mw;
      if (trad && trad !== zh) entry.trad = trad;
      all.push(entry);
      for (const h of fixes) {
        if (h.op !== 'homograph' || h.hsk !== level || h.zh !== zh || h.py !== py) continue;
        all.push({ ...entry, id: wordId(level, zh, py, h.sense), en: h.en, sense: h.sense });
      }
    }
  });
  return { all, problems };
}

// ---------- grammar ----------

type GrammarPoint = { id: string; hsk: string; code: string; title: string; examples: string[] };

const LEVEL_CHAR: Record<string, string> = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7-9': '七—九' };

function importGrammar(): GrammarPoint[] {
  const out: GrammarPoint[] = [];
  for (const level of LEVELS) {
    let cur: GrammarPoint | null = null;
    for (const line of lines(`hsk/grammar-${level}.txt`)) {
      // The transcription sometimes closes the code with ］ instead of 】 (【四29］).
      const m = /^【([^】］]+)[】］]\s*(.*)$/.exec(line);
      if (m) {
        // The level comes from the file: the transcription sometimes writes 二 for 三 in the code (【二35】 in level 3).
        const num = m[1].replace(/\D/g, '');
        cur = { id: `g${level.replace('-', '')}-${num.padStart(level === '7-9' ? 3 : 2, '0')}`, hsk: level, code: `${LEVEL_CHAR[level]}${num}`, title: m[2].trim(), examples: [] };
        out.push(cur);
        continue;
      }
      if (/^[A-Z]\.\d/.test(line)) {
        // A section heading such as "A.1.1.2 动词": the next point's category, not an example.
        cur = null;
        continue;
      }
      if (cur) {
        if (!cur.title) cur.title = line;
        else if (cur.examples.length < 12) cur.examples.push(line);
      }
    }
  }
  return out;
}

// ---------- main ----------

function main() {
  const { entries: cedict, date } = loadCedict();
  const bySimp = new Map<string, CedictEntry[]>();
  for (const e of cedict) bySimp.set(e.simp, [...(bySimp.get(e.simp) ?? []), e]);

  fs.mkdirSync(path.join(OUT, 'hsk'), { recursive: true });

  // Words
  const { all: words, problems } = importWords(bySimp);
  const wordsDoc =
    `# HSK 3.0 words, generated by npm run data:import from vendor sources (see SOURCE.md). Do not edit.\n` +
    `# id = w-<level>-<sha1(zh + py) first 8>; py in tone marks with neutral tones unmarked.\n` +
    words.map((w) => `- ${JSON.stringify(w)}`).join('\n') +
    '\n';
  fs.writeFileSync(path.join(OUT, 'hsk', 'words.yaml'), wordsDoc);

  // Characters
  const chars: Record<string, string> = {};
  const fixes = corrections();
  for (const l of LEVELS) {
    chars[l] = lines(`hsk/hanzi-${l}.txt`)
      .map((c) => (fixes.find((f) => f.op === 'char' && f.hsk === l && f.from === c) as { to: string } | undefined)?.to ?? c)
      .join('');
  }
  fs.writeFileSync(
    path.join(OUT, 'hsk', 'chars.yaml'),
    `# HSK 3.0 characters per level (GF 0025—2021, table 2). Generated; do not edit.\n${yaml.dump(chars, { lineWidth: -1 })}`,
  );

  // Handwriting
  const hw: Record<string, string> = {
    elementary: lines('hsk/handwriting-Elementary.txt').join(''),
    medium: lines('hsk/handwriting-Medium.txt').join(''),
    advanced: lines('hsk/handwriting-Advanced.txt').join(''),
  };
  fs.writeFileSync(
    path.join(OUT, 'hsk', 'handwriting.yaml'),
    `# HSK 3.0 handwriting characters per band (elementary = levels 1–3, medium = 4–6, advanced = 7–9).\n# Generated; do not edit. See SOURCE.md for how rungs use them.\n${yaml.dump(hw, { lineWidth: -1 })}`,
  );

  // Grammar
  const grammar = importGrammar();
  fs.writeFileSync(
    path.join(OUT, 'hsk', 'grammar.yaml'),
    `# HSK 3.0 grammar points (GF 0025—2021, appendix A). Generated; do not edit.\n# id = g<level>-<number>, from the standard's code (【一01】 → g1-01).\n${yaml.dump(grammar, { lineWidth: -1 })}`,
  );

  // CEDICT subset: every HSK word and character, every character of the hanzi data, and every
  // CEDICT word of two to four characters made only of HSK 1–4 characters (for extra words and names).
  const hskChars = new Set([...Object.values(chars).join('')]);
  const lowChars = new Set([...LEVELS.slice(0, 4).map((l) => chars[l]).join('')]);
  const wanted = new Set<string>([...words.map((w) => w.zh), ...hskChars]);
  const subset: Record<string, [string, string][]> = {};
  for (const e of cedict) {
    const len = [...e.simp].length;
    const ok = wanted.has(e.simp) || (len >= 2 && len <= 4 && [...e.simp].every((c) => lowChars.has(c)));
    if (!ok) continue;
    const marks = cedictToMarks(e.py);
    if (!marks) continue;
    (subset[e.simp] ??= []).push([e.trad, marks]);
  }
  fs.writeFileSync(
    path.join(OUT, 'cedict.json'),
    JSON.stringify({ _source: `CC-CEDICT ${date} (CC BY-SA 4.0), subset by data:import`, entries: subset }),
  );

  // Hanzi data (Make Me a Hanzi dictionary.txt) for every HSK character and the parts they use.
  type Mmah = { character: string; definition?: string; pinyin: string[]; decomposition: string; radical: string; etymology?: { type: string; hint?: string; phonetic?: string; semantic?: string }; matches: (number[] | null)[] };
  const dict = new Map<string, Mmah>();
  for (const line of lines('mmah/dictionary.txt')) {
    const d = JSON.parse(line) as Mmah;
    dict.set(d.character, d);
  }
  const hanzi: Record<string, Omit<Mmah, 'character'>> = {};
  const queue = [...hskChars];
  while (queue.length) {
    const c = queue.pop()!;
    if (hanzi[c] || !dict.has(c)) continue;
    const { character: _c, ...rest } = dict.get(c)!;
    hanzi[c] = rest;
    for (const part of [...rest.decomposition]) if (dict.has(part) && !hanzi[part]) queue.push(part);
  }
  fs.writeFileSync(
    path.join(OUT, 'hanzi.json'),
    JSON.stringify({ _source: 'Make Me a Hanzi dictionary.txt (LGPL), subset by data:import', chars: hanzi }),
  );

  // Syllables: the table, with the tones that occur in CC-CEDICT readings.
  const tones = new Map<string, Set<Tone>>();
  for (const e of cedict) {
    for (const p of e.py.replace(/u:/g, 'ü').split(/\s+/)) {
      const m = /^([a-zü]+)([1-5])$/i.exec(p);
      if (!m) continue;
      const base = tableSpelling(m[1]);
      if (!tones.has(base)) tones.set(base, new Set());
      tones.get(base)!.add((Number(m[2]) % 5) as Tone);
    }
  }
  const syl = SYLLABLE_BASES.map((b) => {
    const parts = syllableParts(b)!;
    const t = [...(tones.get(b) ?? [])].sort((a, c) => (a || 5) - (c || 5));
    return { py_base: b, initial: parts.initial, final: parts.final, tones: t };
  });
  const sylFile = path.join(OUT, 'syllables.yaml');
  // Keep audio keys written by audio:syllables.
  const prevAudio = new Map<string, Record<string, string>>();
  if (fs.existsSync(sylFile)) {
    for (const s of (yaml.load(fs.readFileSync(sylFile, 'utf8')) as { py_base: string; audio?: Record<string, string> }[]) ?? []) {
      if (s.audio) prevAudio.set(s.py_base, s.audio);
    }
  }
  fs.writeFileSync(
    sylFile,
    `# Every Putonghua syllable (lib/zh/syllables.ts), the tones attested in CC-CEDICT, and recording keys.\n# Generated by data:import (tones) and audio:syllables (audio); do not edit by hand.\n` +
      syl
        .map((s) => {
          const audio = prevAudio.get(s.py_base);
          return `- ${JSON.stringify({ ...s, ...(audio ? { audio } : {}) })}`;
        })
        .join('\n') +
      '\n',
  );

  // Report
  const per = Object.fromEntries(LEVELS.map((l) => [l, words.filter((w) => w.hsk === l).length]));
  console.log(`data:import — CC-CEDICT ${date}`);
  console.log(`  words per level: ${JSON.stringify(per)} (${words.length})`);
  console.log(`  chars per level: ${JSON.stringify(Object.fromEntries(LEVELS.map((l) => [l, [...chars[l]].length])))}`);
  console.log(`  handwriting: ${JSON.stringify(Object.fromEntries(Object.entries(hw).map(([k, v]) => [k, [...v].length])))}`);
  console.log(`  grammar points: ${JSON.stringify(Object.fromEntries(LEVELS.map((l) => [l, grammar.filter((g) => g.hsk === l).length])))}`);
  console.log(`  cedict subset: ${Object.keys(subset).length} headwords; hanzi: ${Object.keys(hanzi).length} characters`);
  console.log(`  syllables: ${syl.length}, with no attested tone: ${syl.filter((s) => !s.tones.length).map((s) => s.py_base).join(' ') || 'none'}`);
  for (const p of problems) console.warn(`warn  ${p}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) main();
