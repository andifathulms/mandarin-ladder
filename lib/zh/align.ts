import { syllables, type Syllable } from './pinyin';
import { hanChars, tokens, type ZhToken } from './text';

export type AlignedChar = { ch: string; syl: Syllable };

export type AlignedWord = ZhToken & {
  /** The pinyin token as authored (tone marks), markup removed. */
  py: string;
  /** One entry per hanzi, each with its syllable. Empty for punctuation and Latin tokens. */
  chars: AlignedChar[];
};

export class AlignError extends Error {}

/**
 * Pairs each word with its pinyin word and each character with its syllable (CLAUDE.md §7.1).
 * Throws AlignError when the token counts differ, a pinyin word doesn't split into syllables, or a
 * word has a different number of syllables than characters. An erhua r pairs with 儿.
 */
export function alignPinyin(zh: string, py: string): AlignedWord[] {
  const zt = tokens(zh);
  const pt = tokens(py);
  if (zt.length !== pt.length) {
    throw new AlignError(`${zt.length} Chinese tokens but ${pt.length} pinyin tokens: "${zt.map((t) => t.text).join(' ')}" / "${pt.map((t) => t.text).join(' ')}"`);
  }
  return zt.map((z, i) => {
    const p = pt[i];
    if (z.focus !== p.focus) throw new AlignError(`[[focus]] differs at "${z.text}" / "${p.text}"`);
    if (z.kind !== 'han') {
      if (z.kind === 'punct' && p.kind !== 'punct') throw new AlignError(`punctuation "${z.text}" pairs with "${p.text}"`);
      return { ...z, py: p.text, chars: [] };
    }
    const chars = hanChars(z.text);
    const syl = syllables(p.text);
    if (!syl) throw new AlignError(`"${p.text}" (for ${z.text}) does not split into pinyin syllables`);
    if (syl.length !== chars.length) {
      throw new AlignError(`${z.text} has ${chars.length} characters but "${p.text}" has ${syl.length} syllables`);
    }
    syl.forEach((s, k) => {
      if (s.erhua && chars[k] !== '儿') throw new AlignError(`erhua r in "${p.text}" pairs with ${chars[k]}, not 儿`);
    });
    return { ...z, py: p.text, chars: chars.map((ch, k) => ({ ch, syl: syl[k] })) };
  });
}

/** alignPinyin, or null instead of throwing. */
export function tryAlign(zh: string, py: string): AlignedWord[] | null {
  try {
    return alignPinyin(zh, py);
  } catch {
    return null;
  }
}
