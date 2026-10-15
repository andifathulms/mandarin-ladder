import { DAMMA, DAMMATAN, FATHA, FATHATAN, KASRA, KASRATAN, SHADDA, SUKUN, isMark } from './chars';

export const MARK_NAMES = ['fatha', 'kasra', 'damma', 'sukun', 'shadda', 'tanwin-fath', 'tanwin-kasr', 'tanwin-damm'] as const;
export type MarkName = (typeof MARK_NAMES)[number];

export const MARK_CHAR: Record<MarkName, string> = {
  fatha: FATHA,
  kasra: KASRA,
  damma: DAMMA,
  sukun: SUKUN,
  shadda: SHADDA,
  'tanwin-fath': FATHATAN,
  'tanwin-kasr': KASRATAN,
  'tanwin-damm': DAMMATAN,
};

/** Indonesian-friendly names, as pesantren teach them. */
export const MARK_LABEL: Record<MarkName, string> = {
  fatha: 'fathah',
  kasra: 'kasrah',
  damma: 'dhammah',
  sukun: 'sukun',
  shadda: 'syaddah',
  'tanwin-fath': 'tanwin fathah',
  'tanwin-kasr': 'tanwin kasrah',
  'tanwin-damm': 'tanwin dhammah',
};

export const MARK_SOUND: Record<MarkName, string> = {
  fatha: 'a',
  kasra: 'i',
  damma: 'u',
  sukun: '–',
  shadda: '×2',
  'tanwin-fath': 'an',
  'tanwin-kasr': 'in',
  'tanwin-damm': 'un',
};

/** The letters of a word with the marks each carries. */
export function lettersWithMarks(word: string): { letter: string; marks: string; start: number; end: number }[] {
  const out: { letter: string; marks: string; start: number; end: number }[] = [];
  const w = word.normalize('NFC');
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    if (isMark(ch) && out.length) {
      out[out.length - 1].marks += ch;
      out[out.length - 1].end = i + 1;
    } else out.push({ letter: ch, marks: '', start: i, end: i + 1 });
  }
  return out;
}

/**
 * The tested mark on a letter: a vowel or tanwin wins over shaddah when both are present
 * (a shaddah item marks a letter that carries shaddah and no other vowel being asked).
 */
export function markOn(word: string, target: number): MarkName | null {
  const l = lettersWithMarks(word)[target];
  if (!l) return null;
  const order: MarkName[] = ['tanwin-fath', 'tanwin-kasr', 'tanwin-damm', 'fatha', 'kasra', 'damma', 'sukun'];
  const has = (n: MarkName) => l.marks.includes(MARK_CHAR[n]);
  if (has('shadda')) return 'shadda';
  return order.find(has) ?? null;
}

/** The word with the target letter's marks removed, for the mark item prompt. */
export function withoutMark(word: string, target: number): { before: string; letter: string; after: string } {
  const ls = lettersWithMarks(word);
  const w = word.normalize('NFC');
  const l = ls[target];
  return { before: w.slice(0, l.start), letter: l.letter, after: w.slice(l.end) };
}
