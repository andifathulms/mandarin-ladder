// Build-time only: the imported HSK 3.0, CC-CEDICT and Make Me a Hanzi data in content/data.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export const HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '7-9'] as const;
export type HskLevel = (typeof HSK_LEVELS)[number];

export type HskWord = { id: string; zh: string; py: string; hsk: HskLevel; en: string; mw?: string[]; trad?: string; sense?: number };
export type GrammarPoint = { id: string; hsk: HskLevel; code: string; title: string; examples: string[] };
export type HanziInfo = {
  definition?: string;
  pinyin: string[];
  decomposition: string;
  radical: string;
  etymology?: { type: string; hint?: string; phonetic?: string; semantic?: string };
  matches: (number[] | null)[];
};
export type SyllableInfo = { py_base: string; initial: string; final: string; tones: number[]; audio?: Record<string, string> };

const DATA = path.join(process.cwd(), 'content', 'data');
const cache = new Map<string, unknown>();
function load<T>(file: string, parse: (s: string) => T): T {
  if (!cache.has(file)) cache.set(file, parse(fs.readFileSync(path.join(DATA, file), 'utf8')));
  return cache.get(file) as T;
}
const y = (s: string) => yaml.load(s, { schema: yaml.JSON_SCHEMA });

export const getWords = () => load('hsk/words.yaml', (s) => y(s) as HskWord[]);
export const getChars = () => load('hsk/chars.yaml', (s) => y(s) as Record<HskLevel, string>);
export const getGrammar = () => load('hsk/grammar.yaml', (s) => y(s) as GrammarPoint[]);
export const getHandwriting = () => load('hsk/handwriting.yaml', (s) => y(s) as { elementary: string; medium: string; advanced: string });
export const getCedict = () => load('cedict.json', (s) => (JSON.parse(s) as { entries: Record<string, [string, string][]> }).entries);
export const getHanzi = () => load('hanzi.json', (s) => (JSON.parse(s) as { chars: Record<string, HanziInfo> }).chars);
export const getSyllables = () => load('syllables.yaml', (s) => y(s) as SyllableInfo[]);

export const levelIndex = (l: string) => HSK_LEVELS.indexOf(l as HskLevel);

/**
 * The highest HSK level a rung may draw on. The Dasar rungs teach with HSK 1 material; a rung with
 * hsk "—" otherwise counts as level 1.
 */
export function rungLevel(rung: { hsk: string }): HskLevel {
  return (rung.hsk === '—' ? '1' : rung.hsk) as HskLevel;
}

/** Words of this level and below, keyed by characters. */
export function wordsUpTo(level: HskLevel): Map<string, HskWord[]> {
  const max = levelIndex(level);
  const out = new Map<string, HskWord[]>();
  for (const w of getWords()) if (levelIndex(w.hsk) <= max) out.set(w.zh, [...(out.get(w.zh) ?? []), w]);
  return out;
}

export function charsUpTo(level: HskLevel): Set<string> {
  const c = getChars();
  return new Set(HSK_LEVELS.slice(0, levelIndex(level) + 1).flatMap((l) => [...c[l]]));
}

/**
 * Handwriting characters a rung may ask learners to trace. The standard publishes the list by band
 * (elementary = levels 1–3); within the elementary band we take the characters of this level and
 * below (see content/data/hsk/SOURCE.md).
 */
export function handwritingUpTo(level: HskLevel): Set<string> {
  const hw = getHandwriting();
  const i = levelIndex(level);
  const bands = [...hw.elementary, ...(i >= 3 ? [...hw.medium] : []), ...(i >= 6 ? [...hw.advanced] : [])];
  const chars = charsUpTo(level);
  return new Set(bands.filter((c) => chars.has(c)));
}
