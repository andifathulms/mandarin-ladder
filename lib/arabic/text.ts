import { SHADDA, TANWIN, TATWEEL, isArabic, isHarakah } from './chars';

const AR_PUNCT: Record<string, string> = { '،': ',', '؛': ';', '؟': '?', '٪': '%', '۔': '.' };

/** NFC; no tatweel; Arabic punctuation mapped to a canonical set; whitespace collapsed. */
export function normalise(s: string): string {
  return s
    .normalize('NFC')
    .replace(new RegExp(TATWEEL, 'g'), '')
    .replace(/[،؛؟٪۔]/g, (c) => AR_PUNCT[c])
    .replace(/[‌‍]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export type KeepOpts = {
  /** Keep shaddah. */
  shadda?: boolean;
  /** Keep tanwin. */
  tanwin?: boolean;
  /** Keep every mark inside these [start, end) ranges of the input. */
  ranges?: [number, number][];
};

/** Removes vowel marks (U+064B–U+0652, U+0670, Qur'anic signs). Hamza and madda stay. */
export function stripHarakat(s: string, keep: KeepOpts = {}): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (!isHarakah(ch)) {
      out += ch;
      continue;
    }
    if (keep.shadda && ch === SHADDA) out += ch;
    else if (keep.tanwin && TANWIN.has(ch)) out += ch;
    else if (keep.ranges?.some(([a, b]) => i >= a && i < b)) out += ch;
  }
  return out;
}

/** Partial harakat (Medium 2 – Hard 1): shaddah, tanwin and the focus words keep their marks. */
export function partialHarakat(s: string, focusRanges: [number, number][] = []): string {
  return stripHarakat(s, { shadda: true, tanwin: true, ranges: focusRanges });
}

/**
 * The comparison key for loose grading and search: no harakat, alef/hamza seats unified,
 * ى → ي and ة → ه, punctuation removed.
 */
export function looseKey(s: string): string {
  return stripHarakat(normalise(s))
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[.,;:!?"'«»()[\]\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export type Token = { text: string; start: number; end: number };

const WORD_RE = /[^\s.,;:!?"'«»()[\]،؛؟۔]+/gu;

/** Words of a string (split on whitespace and punctuation), with offsets into the original. */
export function tokenise(s: string): Token[] {
  return [...s.matchAll(WORD_RE)].map((m) => ({ text: m[0], start: m.index!, end: m.index! + m[0].length }));
}

export type Run = { text: string; start: number; end: number };

/**
 * Arabic runs inside mixed prose, so Prose can wrap each in an island. A run takes in the spaces,
 * punctuation and joiners between Arabic words, but never trailing ones.
 */
export function findArabicRuns(text: string): Run[] {
  const runs: Run[] = [];
  const bridge = /[\s.,!?:;()«»"-]/;
  const inRun = (ch: string) => isArabic(ch) || ch === '\u200D' || ch === '\u200C';
  let i = 0;
  while (i < text.length) {
    if (!isArabic(text[i])) {
      i++;
      continue;
    }
    const start = i;
    let end = i;
    let j = i;
    while (j < text.length) {
      if (inRun(text[j])) {
        end = ++j;
        continue;
      }
      if (!bridge.test(text[j])) break;
      // Bridge spaces and punctuation only when more Arabic follows before anything else.
      let k = j;
      while (k < text.length && bridge.test(text[k])) k++;
      if (k < text.length && isArabic(text[k])) j = k;
      else break;
    }
    runs.push({ text: text.slice(start, end), start, end });
    i = end;
  }
  return runs;
}

export function hasArabic(s: string): boolean {
  for (const ch of s) if (isArabic(ch)) return true;
  return false;
}

/** Arabic-Indic digits (٠–٩) to Western digits, for UI numerals. */
export function westernDigits(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}
