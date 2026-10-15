// Build-time only.
import { getChars, getHanzi, getSyllables, getWords, levelIndex } from './hsk';
import { getMeasureWords, getRadicals, getStrokeNames } from './load';
import { hanziCard, topParts } from './lessonData';
import { syllables } from '../zh/pinyin';
import type { HanziCard } from '../types';
import type { VisualDataValue } from '@/components/visuals/VisualData';

/** A word of HSK 1–3 for each syllable and tone, single characters first ("ma3" → 马 mǎ). */
function syllableExamples(): VisualDataValue['examples'] {
  const out: VisualDataValue['examples'] = {};
  const words = getWords()
    .filter((w) => levelIndex(w.hsk) <= 2 && !w.py.includes(' '))
    .sort((a, b) => [...a.zh].length - [...b.zh].length || levelIndex(a.hsk) - levelIndex(b.hsk));
  for (const w of words) {
    const syl = syllables(w.py);
    if (!syl || syl.length !== [...w.zh].length) continue;
    for (const s of syl) {
      if (!s.tone || s.erhua) continue;
      const k = `${s.base}${s.tone}`;
      out[k] ??= { zh: w.zh, py: w.py };
    }
  }
  return out;
}

/** HSK 1–3 characters that use each component of the given characters, most common first. */
function families(chars: Iterable<string>): VisualDataValue['family'] {
  const hanzi = getHanzi();
  const pool = ['1', '2', '3'].flatMap((l) => [...getChars()[l as '1']]);
  const out: VisualDataValue['family'] = {};
  for (const c of chars) {
    const h = hanzi[c];
    if (!h) continue;
    for (const part of topParts(h.decomposition).parts) {
      if (out[part]) continue;
      out[part] = pool.filter((x) => x !== part && hanzi[x] && topParts(hanzi[x].decomposition).parts.includes(part)).slice(0, 8);
    }
  }
  return out;
}

/**
 * Data visuals need: the syllable table, measure words, radicals, parts and families for the given
 * characters, and (for SyllableBuilder) an example word per syllable.
 */
export function visualData(chars: string[] = [], opts: { examples?: boolean } = {}): VisualDataValue {
  const family = families(chars);
  const hanzi: Record<string, HanziCard> = {};
  // The characters themselves, and the ones that share their parts (so they can be opened too).
  for (const c of new Set([...chars, ...Object.values(family).flat()])) {
    const h = hanziCard(c);
    if (h) hanzi[c] = h;
  }
  return {
    syllables: getSyllables().map((s) => ({ b: s.py_base, i: s.initial, f: s.final, t: s.tones })),
    measureWords: getMeasureWords(),
    radicals: getRadicals(),
    hanzi,
    strokeNames: getStrokeNames(),
    examples: opts.examples ? syllableExamples() : {},
    family,
  };
}
