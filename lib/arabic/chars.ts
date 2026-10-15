// Arabic character classes. Pure data, no dependencies.

export const ZWJ = '‍';
export const ZWNJ = '‌';
export const TATWEEL = 'ـ';

export const FATHA = 'َ';
export const KASRA = 'ِ';
export const DAMMA = 'ُ';
export const SUKUN = 'ْ';
export const SHADDA = 'ّ';
export const FATHATAN = 'ً';
export const KASRATAN = 'ٍ';
export const DAMMATAN = 'ٌ';
export const DAGGER_ALIF = 'ٰ';

export const TANWIN = new Set([FATHATAN, KASRATAN, DAMMATAN]);

/** Vowel marks and signs removed by stripHarakat (hamza and madda are kept: they are part of letters). */
export function isHarakah(ch: string): boolean {
  const c = ch.codePointAt(0)!;
  return (
    (c >= 0x064b && c <= 0x0652) ||
    (c >= 0x0656 && c <= 0x065f) ||
    c === 0x0670 ||
    (c >= 0x06d6 && c <= 0x06dc) ||
    (c >= 0x06df && c <= 0x06e8) ||
    (c >= 0x06ea && c <= 0x06ed)
  );
}

/** Any combining mark that sits on a letter (harakat plus hamza/madda above or below). */
export function isMark(ch: string): boolean {
  const c = ch.codePointAt(0)!;
  return isHarakah(ch) || (c >= 0x0653 && c <= 0x0655);
}

export function isArabic(ch: string): boolean {
  const c = ch.codePointAt(0);
  if (c === undefined) return false;
  return (
    (c >= 0x0600 && c <= 0x06ff) ||
    (c >= 0x0750 && c <= 0x077f) ||
    (c >= 0x08a0 && c <= 0x08ff) ||
    (c >= 0xfb50 && c <= 0xfdff) ||
    (c >= 0xfe70 && c <= 0xfeff)
  );
}

/** A base Arabic letter (not a mark, digit or punctuation). */
export function isArabicLetter(ch: string): boolean {
  const c = ch.codePointAt(0)!;
  return (c >= 0x0621 && c <= 0x064a) || c === 0x0671 || (c >= 0x0672 && c <= 0x06d3 && c !== 0x06d4);
}

// Joining types (Unicode ArabicShaping): R joins only to the letter before it; U never joins.
const RIGHT_ONLY = new Set([...'اأإآٱدذرزوؤة']);
const NON_JOINING = new Set(['ء']);

/** True when the letter connects to the following letter (it has initial/medial forms). */
export function joinsLeft(ch: string): boolean {
  return isArabicLetter(ch) && !RIGHT_ONLY.has(ch) && !NON_JOINING.has(ch);
}

/** True when the letter can connect to the letter before it. */
export function joinsRight(ch: string): boolean {
  return (isArabicLetter(ch) && !NON_JOINING.has(ch)) || ch === TATWEEL;
}

/** The six letters (plus their hamza/madda variants) that never join forward. */
export const NON_JOINERS = ['ا', 'د', 'ذ', 'ر', 'ز', 'و'] as const;

export const SUN_LETTERS = new Set([...'تثدذرزسشصضطظلن']);
export const MOON_LETTERS = new Set([...'أإآابجحخعغفقكمهوي']);
