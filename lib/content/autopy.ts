// Build-time only. Pinyin for the Chinese strings inside check items (CLAUDE.md §5.3), so authors
// write the Chinese once. Explicit entries in an item's `py` map always win; lint reports any string
// it could not resolve, so nothing reaches the page without pinyin.
import { getCedict, getWords, levelIndex } from './hsk';
import { buTone, yiTone } from '../zh/sandhi';
import { markSyllable, stripTone, syllables, type Tone } from '../zh/pinyin';
import { hanChars, hasHan, tokens } from '../zh/text';
import type { CheckItem, GlossaryEntry } from '../types';

export type Names = { zh: string; py: string }[];

/** Readings chosen for single characters that are several words at HSK 1 (地 de/dì and the like). */
const DEFAULT_READING: Record<string, string> = {
  地: 'dì',
  干: 'gàn',
  还: 'hái',
  得: 'de',
  了: 'le',
  着: 'zhe',
  长: 'cháng',
  好: 'hǎo',
  都: 'dōu',
  和: 'hé',
  只: 'zhǐ',
  少: 'shǎo',
  觉: 'jué',
  行: 'xíng',
  重: 'zhòng',
  教: 'jiāo',
  种: 'zhǒng',
  为: 'wèi',
  一: 'yī',
  不: 'bù',
  个: 'gè',
  子: 'zǐ',
  么: 'me',
  的: 'de',
};

const DIGITS: Record<string, string> = { 零: 'líng', 〇: 'líng', 一: 'yī', 二: 'èr', 两: 'liǎng', 三: 'sān', 四: 'sì', 五: 'wǔ', 六: 'liù', 七: 'qī', 八: 'bā', 九: 'jiǔ', 十: 'shí', 百: 'bǎi', 千: 'qiān', 万: 'wàn' };

let lexicon: Map<string, string[]> | null = null;

/** Every reading per word: HSK words first (lowest level first), then CC-CEDICT. */
function readings(): Map<string, string[]> {
  if (lexicon) return lexicon;
  const m = new Map<string, string[]>();
  const add = (zh: string, py: string) => {
    const list = m.get(zh) ?? [];
    const key = py.replace(/\s+/g, '');
    if (!list.includes(key)) list.push(key);
    m.set(zh, list);
  };
  const words = [...getWords()].sort((a, b) => levelIndex(a.hsk) - levelIndex(b.hsk));
  for (const w of words) add(w.zh, w.py);
  for (const [zh, list] of Object.entries(getCedict())) for (const [, py] of list) if (!/^[A-Z]/.test(py)) add(zh, py);
  lexicon = m;
  return m;
}

/** The reading of one authored word (no spaces), or null. */
export function wordReading(zh: string, glossary: GlossaryEntry[], names: Names): string | null {
  const g = glossary.find((x) => x.zh === zh);
  if (g) return g.py.replace(/\s+/g, '');
  const n = names.find((x) => x.zh === zh);
  if (n) return n.py.replace(/\s+/g, '');
  // A part of a two-word name (王 of 王 明).
  for (const x of names) {
    const zs = x.zh.split(/\s+/);
    const ps = x.py.split(/\s+/);
    if (zs.length === ps.length && zs.includes(zh)) return ps[zs.indexOf(zh)];
  }
  if (DEFAULT_READING[zh]) return DEFAULT_READING[zh];
  if ([...zh].every((c) => DIGITS[c])) return joinSyllables([...zh].map((c) => DIGITS[c]));
  const r = readings().get(zh);
  if (r?.length) return r[0];
  // Fall back to character by character, only when every character is unambiguous.
  const chars = hanChars(zh);
  if (chars.length > 1 && chars.length === [...zh].length) {
    const each = chars.map((c) => DEFAULT_READING[c] ?? (readings().get(c)?.length === 1 ? readings().get(c)![0] : null));
    if (each.every(Boolean)) return joinSyllables(each as string[]);
  }
  return null;
}

/** Joins syllables into one pinyin word, with an apostrophe before a/o/e after the first (shí'èr). */
export function joinSyllables(syls: string[]): string {
  return syls.map((p, k) => (k > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(p.normalize('NFC')) ? `'${p}` : p)).join('');
}

/** Splits a run of hanzi with no spaces into known words, longest first. */
function segment(run: string): string[] {
  const out: string[] = [];
  const chars = [...run];
  let i = 0;
  while (i < chars.length) {
    let len = Math.min(4, chars.length - i);
    for (; len > 1; len--) if (readings().has(chars.slice(i, i + len).join(''))) break;
    out.push(chars.slice(i, i + len).join(''));
    i += len;
  }
  return out;
}

/**
 * 一 and 不 are written with their spoken tones in this app's pinyin (CLAUDE.md §5.2): apply the rules to
 * a list of words and their citation readings.
 */
function spoken(words: { zh: string; py: string }[]): string[] {
  const flat: { ch: string; syl: string; tone: Tone; w: number }[] = [];
  words.forEach((w, wi) => {
    const syl = syllables(w.py);
    const chars = hanChars(w.zh);
    if (!syl || syl.length !== chars.length) return;
    syl.forEach((s, k) => flat.push({ ch: chars[k], syl: s.text, tone: s.tone, w: wi }));
  });
  const out = words.map((w) => w.py);
  if (!flat.length) return out;
  const perWord = new Map<number, string[]>();
  flat.forEach((f, i) => {
    let text = f.syl;
    const next = flat[i + 1] ? { ch: flat[i + 1].ch, tone: flat[i + 1].tone } : null;
    if (f.ch === '一' && f.tone !== 0) text = markSyllable(stripTone(f.syl), yiTone(i > 0 ? flat[i - 1].ch : null, next));
    if (f.ch === '不' && f.tone !== 0) text = markSyllable(stripTone(f.syl), buTone(next));
    perWord.set(f.w, [...(perWord.get(f.w) ?? []), text]);
  });
  return words.map((w, i) => {
    const parts = perWord.get(i);
    if (!parts) return w.py;
    return parts.map((p, k) => (k > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(p) ? `'${p}` : p)).join('');
  });
}

/** Pinyin for an authored Chinese string ("我 ___ 学生 。"), token for token, or null. */
export function pinyinFor(zh: string, glossary: GlossaryEntry[], names: Names): string | null {
  const toks = tokens(zh);
  const words: { zh: string; py: string }[] = [];
  const out: string[] = [];
  for (const t of toks) {
    if (t.kind === 'punct') {
      out.push(t.text.replace(/[，。！？：；、]/g, (c) => ({ '，': ',', '。': '.', '！': '!', '？': '?', '：': ':', '；': ';', '、': ',' })[c] ?? c));
      continue;
    }
    if (t.kind === 'latin') {
      out.push(t.text);
      continue;
    }
    const py = wordReading(t.text, glossary, names);
    if (!py) return null;
    words.push({ zh: t.text, py });
    out.push(`\u0000${words.length - 1}`);
  }
  const sp = spoken(words);
  return toks
    .map((t, i) => {
      const o = out[i];
      const body = o.startsWith('\u0000') ? sp[Number(o.slice(1))] : o;
      return t.focus ? `[[${body}]]` : body;
    })
    .join(' ')
    .replace(/\]\] \[\[/g, ' ');
}

/** Pinyin for each hanzi run inside mostly-Latin text ("Apa arti **桌子**?"), keyed by the run. */
export function runPinyin(text: string, glossary: GlossaryEntry[], names: Names, given: Record<string, string> = {}): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const m of text.matchAll(/\p{Script=Han}+/gu)) {
    const run = m[0];
    // An item's own py map wins (e.g. a bare component like 讠 that is no word).
    if (given[run]) continue;
    const words = segment(run).map((w) => ({ zh: w, py: wordReading(w, glossary, names) }));
    if (words.some((w) => !w.py)) return null;
    // One token for the whole run, so it aligns as one ruby "word" inside Latin text.
    out[run] = joinSyllables(spoken(words as { zh: string; py: string }[]));
  }
  return out;
}

/** Every Chinese string an item shows or plays, as written. */
export function itemChinese(item: CheckItem): string[] {
  const out: string[] = [];
  const push = (s?: string) => {
    if (s && hasHan(s)) out.push(s);
  };
  switch (item.type) {
    case 'choice':
    case 'gap':
      push(item.prompt);
      item.options.forEach(push);
      break;
    case 'order':
      push(item.prompt);
      item.tiles.forEach(push);
      break;
    case 'scene':
      push(item.prompt);
      item.options.forEach(push);
      break;
    case 'fix':
      push(item.wrong);
      item.options.forEach(push);
      break;
    case 'listen':
      push(item.audio);
      item.options.forEach(push);
      push(item.prompt);
      break;
    case 'tone':
    case 'pinyin':
      if (!/^syl-/.test(item.audio)) push(item.audio);
      push(item.prompt);
      break;
    case 'trace':
    case 'build':
      push(item.prompt);
      break;
  }
  return out;
}

const isLatinLine = (s: string) => /[A-Za-z]/.test(s.replace(/\*\*|\*|\[\[|\]\]/g, ''));

/**
 * Fills item.py for every Chinese string it shows. Pure Chinese strings get token-for-token pinyin;
 * hanzi runs inside Latin text get one entry per run. Returns the strings it could not resolve.
 */
export function fillItemPinyin(item: CheckItem, glossary: GlossaryEntry[], names: Names): { item: CheckItem; missing: string[] } {
  const py: Record<string, string> = { ...(item.py ?? {}) };
  const missing: string[] = [];
  if (item.type === 'tone' && item.audio_py) py[item.audio] ??= item.audio_py;
  for (const s of itemChinese(item)) {
    if (py[s]) continue;
    if (isLatinLine(s)) {
      const runs = runPinyin(s.replace(/___/g, ' '), glossary, names, py);
      if (!runs) missing.push(s);
      else for (const [k, v] of Object.entries(runs)) py[k] ??= v;
      continue;
    }
    const p = pinyinFor(s, glossary, names);
    if (p) py[s] = p;
    else missing.push(s);
  }
  return { item: { ...item, py }, missing };
}

