// Build-time only.
import { getSyllables } from './hsk';
import { getMeasureWords, getRadicals } from './load';
import { hanziCard } from './lessonData';
import type { HanziCard } from '../types';
import type { VisualDataValue } from '@/components/visuals/VisualData';

/** Data visuals need: the syllable table, measure words, radicals, and parts for the given characters. */
export function visualData(chars: string[] = []): VisualDataValue {
  const hanzi: Record<string, HanziCard> = {};
  for (const c of new Set(chars)) {
    const h = hanziCard(c);
    if (h) hanzi[c] = h;
  }
  return {
    syllables: getSyllables().map((s) => ({ b: s.py_base, i: s.initial, f: s.final, t: s.tones })),
    measureWords: getMeasureWords(),
    radicals: getRadicals(),
    hanzi,
  };
}
