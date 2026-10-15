// Spoken tones from written ones (CLAUDE.md §5.2, §7.1). Pinyin is authored with citation tones,
// except 一 and 不, which textbooks write with their spoken tones (yí gè, bú shì). This module turns
// either into { written, spoken } per syllable for the Nada card, SandhiStrip and `tone` items.
import type { Tone } from './pinyin';
import type { AlignedWord } from './align';

export type SandhiSyllable = {
  ch: string;
  /** Citation tone (dictionary form): 一 is yī and 不 is bù here. */
  written: Tone;
  spoken: Tone;
  /** Which rule changed it, if any. */
  rule?: '3-3' | 'bu' | 'yi';
};

export type SandhiWord = { text: string; punct: boolean; syllables: SandhiSyllable[] };

/** After these, 一 is a number being read out (十一, 第一, 二十一) and keeps tone 1. */
const YI_KEEP_BEFORE = new Set([...'零〇二三四五六七八九十第']);
/** Before these, 一 keeps tone 1: counting (一二三, 一一), months and dates (一月, 一号), floors (一楼). */
const YI_KEEP_NEXT = new Set([...'零〇一二三四五六七八九十月号楼']);

/**
 * 一 in context: yī when counting, final, ordinal or part of a number; yí before tone 4 (or before a
 * neutral syllable, as in 一个 yí ge, 一下 yíxià); yì before tones 1, 2 and 3.
 */
export function yiTone(prev: string | null, next: { ch: string; tone: Tone } | null): Tone {
  if (!next) return 1;
  if (prev && YI_KEEP_BEFORE.has(prev)) return 1;
  if (YI_KEEP_NEXT.has(next.ch)) return 1;
  if (next.tone === 4 || next.tone === 0) return 2;
  return 4;
}

/** 不 in context: bú before tone 4, bù otherwise (and finally). */
export function buTone(next: { tone: Tone } | null): Tone {
  return next && next.tone === 4 ? 2 : 4;
}

/**
 * Applies the rules over aligned words, clause by clause (punctuation breaks a clause):
 *  1. 一 and 不 take their spoken tones from the next syllable's citation tone. Neutral 一/不
 *     (看一看, 对不起) stay neutral.
 *  2. A run of third tones becomes second tones except the last (你好 ní hǎo, 我很好 wó hén hǎo).
 *     A neutral syllable ends the run (姐姐 jiějie stays).
 */
export function sandhi(words: AlignedWord[]): SandhiWord[] {
  const out: SandhiWord[] = words.map((w) => ({
    text: w.text,
    punct: w.kind === 'punct',
    syllables: w.chars.map(({ ch, syl }) => {
      // Citation tones for 一 and 不 (authored spoken); keep authored neutral.
      const written: Tone = syl.tone === 0 ? 0 : ch === '一' ? 1 : ch === '不' ? 4 : syl.tone;
      return { ch, written, spoken: written };
    }),
  }));

  // Clauses: flat syllable lists between punctuation tokens.
  const clauses: SandhiSyllable[][] = [[]];
  for (const w of out) {
    if (w.punct) clauses.push([]);
    else clauses[clauses.length - 1].push(...w.syllables);
  }

  for (const c of clauses) {
    c.forEach((s, i) => {
      if (s.written === 0) return;
      const next = c[i + 1] ? { ch: c[i + 1].ch, tone: c[i + 1].written } : null;
      if (s.ch === '一') {
        const t = yiTone(i > 0 ? c[i - 1].ch : null, next);
        if (t !== s.written) {
          s.spoken = t;
          s.rule = 'yi';
        }
      } else if (s.ch === '不') {
        const t = buTone(next);
        if (t !== s.written) {
          s.spoken = t;
          s.rule = 'bu';
        }
      }
    });
    // Third-tone runs, on the tones after 一/不 have changed.
    let i = 0;
    while (i < c.length) {
      if (c[i].spoken !== 3) {
        i += 1;
        continue;
      }
      let j = i;
      while (j + 1 < c.length && c[j + 1].spoken === 3) j += 1;
      for (let k = i; k < j; k++) {
        c[k].spoken = 2;
        c[k].rule = '3-3';
      }
      i = j + 1;
    }
  }
  return out;
}

/** Flat spoken tones, e.g. for `tone` items with ask: spoken. */
export function spokenTones(words: AlignedWord[]): Tone[] {
  return sandhi(words).flatMap((w) => w.syllables.map((s) => s.spoken));
}

/** Flat written (citation) tones. */
export function writtenTones(words: AlignedWord[]): Tone[] {
  return sandhi(words).flatMap((w) => w.syllables.map((s) => s.written));
}
