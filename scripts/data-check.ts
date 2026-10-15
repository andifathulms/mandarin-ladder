/*
 * Checks the imported data in content/data against the HSK 3.0 standard's published totals
 * (PRD §4.2) and the curriculum's cumulative targets. Run by `npm run build`. Exits non-zero on error.
 * With --lock, (re)writes content/data/hsk/word-ids.lock after a deliberate import.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getCurriculum } from '../lib/content/load';
import { getChars, getGrammar, getHandwriting, getWords, HSK_LEVELS } from '../lib/content/hsk';
import { syllables } from '../lib/zh/pinyin';
import { hanChars } from '../lib/zh/text';

/** GF 0025—2021 totals per level. */
export const STANDARD = {
  words: { '1': 500, '2': 772, '3': 973, '4': 1000, '5': 1071, '6': 1140, '7-9': 5636 },
  chars: { '1': 300, '2': 300, '3': 300, '4': 300, '5': 300, '6': 300, '7-9': 1200 },
  grammar: { '1': 48, '2': 81, '3': 81, '4': 76, '5': 71, '6': 67, '7-9': 148 },
  handwriting: { elementary: 300, medium: 400, advanced: 500 },
} as const;

const LOCK = path.join(process.cwd(), 'content', 'data', 'hsk', 'word-ids.lock');

const errors: string[] = [];
const err = (m: string) => errors.push(m);

const words = getWords();
const chars = getChars();
const grammar = getGrammar();
const hw = getHandwriting();

for (const l of HSK_LEVELS) {
  const n = words.filter((w) => w.hsk === l).length;
  if (n !== STANDARD.words[l]) err(`words.yaml: HSK ${l} has ${n} words; the standard has ${STANDARD.words[l]}`);
  const c = [...chars[l]].length;
  if (c !== STANDARD.chars[l]) err(`chars.yaml: HSK ${l} has ${c} characters; the standard has ${STANDARD.chars[l]}`);
  const g = grammar.filter((x) => x.hsk === l).length;
  if (g !== STANDARD.grammar[l]) err(`grammar.yaml: HSK ${l} has ${g} points; the standard has ${STANDARD.grammar[l]}`);
}
for (const [band, n] of Object.entries(STANDARD.handwriting)) {
  const got = [...hw[band as keyof typeof hw]].length;
  if (got !== n) err(`handwriting.yaml: ${band} has ${got} characters; the standard has ${n}`);
}
const allChars = Object.values(chars).join('');
if (new Set(allChars).size !== [...allChars].length) err('chars.yaml: a character appears in two levels');
const low = new Set([...chars['1'], ...chars['2'], ...chars['3']]);
for (const c of hw.elementary) if (!low.has(c)) err(`handwriting.yaml: elementary ${c} is not an HSK 1–3 character`);

// Ids: unique, and every id ever shipped is still here (CLAUDE.md §6.11).
const ids = new Set<string>();
for (const w of words) {
  if (ids.has(w.id)) err(`words.yaml: duplicate id ${w.id} (${w.zh})`);
  ids.add(w.id);
  for (const part of w.py.split(' ')) if (!syllables(part)) err(`words.yaml: ${w.zh} has unreadable pinyin "${w.py}"`);
  const n = hanChars(w.zh).length;
  const s = w.py.split(' ').reduce((k, p) => k + (syllables(p)?.length ?? 0), 0);
  if (n && s !== n && !/[A-Za-z]/.test(w.zh)) err(`words.yaml: ${w.zh} has ${n} characters but "${w.py}" has ${s} syllables`);
}
if (process.argv.includes('--lock')) {
  const prev = fs.existsSync(LOCK) ? fs.readFileSync(LOCK, 'utf8').split('\n').filter(Boolean) : [];
  const merged = [...new Set([...prev, ...ids])].sort();
  fs.writeFileSync(LOCK, `${merged.join('\n')}\n`);
  console.log(`data:check — wrote ${merged.length} ids to word-ids.lock`);
}
if (fs.existsSync(LOCK)) {
  for (const id of fs.readFileSync(LOCK, 'utf8').split('\n').filter(Boolean)) {
    if (!ids.has(id)) err(`words.yaml: word id ${id} was shipped and must not disappear`);
  }
} else err('content/data/hsk/word-ids.lock is missing (npm run data:check -- --lock after an import)');

// Curriculum targets (PRD §4.2): exact for levels 1–6 and the last Hard rung; the Hard 1–2 splits are approximate.
const levelOf: Record<string, string> = { '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6' };
let cumW = 0;
let cumC = 0;
const cum: Record<string, { w: number; c: number }> = {};
for (const l of HSK_LEVELS) {
  cumW += STANDARD.words[l];
  cumC += STANDARD.chars[l];
  cum[l] = { w: cumW, c: cumC };
}
for (const r of getCurriculum()) {
  if (r.hsk === '—') continue;
  if (levelOf[r.hsk] || r.id === 'hard-3') {
    const t = cum[r.hsk];
    if (r.words_cum !== t.w) err(`curriculum.yaml: ${r.id} words_cum ${r.words_cum}; HSK ${r.hsk} cumulative is ${t.w}`);
    if (r.chars_cum !== t.c) err(`curriculum.yaml: ${r.id} chars_cum ${r.chars_cum}; HSK ${r.hsk} cumulative is ${t.c}`);
  }
}

for (const e of errors) console.error(`error ${e}`);
console.log(`data:check — ${words.length} words, ${[...allChars].length} characters, ${grammar.length} grammar points: ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
