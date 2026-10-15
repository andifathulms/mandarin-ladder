import { ZWJ, isArabicLetter, isMark, joinsLeft, joinsRight } from './chars';

/** The last base letter of a string, skipping marks and joiners. */
function lastLetter(s: string): string | null {
  for (let i = s.length - 1; i >= 0; i--) {
    const ch = s[i];
    if (isMark(ch) || ch === ZWJ) continue;
    return isArabicLetter(ch) ? ch : null;
  }
  return null;
}

/** The first base letter of a string, or null when it starts with anything else. */
function firstLetter(s: string): string | null {
  for (const ch of s) {
    if (ch === ZWJ) continue;
    return isArabicLetter(ch) ? ch : null;
  }
  return null;
}

/** True when two adjacent pieces of one word are joined in the written word. */
export function joinedAcross(before: string, after: string): boolean {
  const a = lastLetter(before);
  const b = firstLetter(after);
  return !!a && !!b && joinsLeft(a) && joinsRight(b);
}

/**
 * Adds U+200D on both sides of every boundary between adjacent pieces that are joined in the
 * written word, so styling one piece (colour, underline) never breaks the letter shapes.
 * Pieces that are not joined (after ا د ذ ر ز و, or at a space) are left untouched.
 */
export function joinSafeSegments(pieces: string[]): string[] {
  const out = [...pieces];
  for (let i = 0; i < pieces.length - 1; i++) {
    if (joinedAcross(pieces[i], pieces[i + 1])) {
      out[i] = out[i] + ZWJ;
      out[i + 1] = ZWJ + out[i + 1];
    }
  }
  return out;
}

export type JoinSeg = { text: string; start: number; end: number; focus: boolean };

/**
 * Splits one word into styled segments at the given [start, end) ranges (offsets into the word),
 * inserting ZWJ at each joined internal boundary.
 */
export function joinSafeSplit(word: string, ranges: [number, number][]): JoinSeg[] {
  const cuts = new Set<number>([0, word.length]);
  for (const [a, b] of ranges) {
    cuts.add(Math.max(0, Math.min(word.length, a)));
    cuts.add(Math.max(0, Math.min(word.length, b)));
  }
  // Never cut between a letter and its marks: move a cut forward past any marks.
  const fixed = [...cuts]
    .map((c) => {
      let k = c;
      while (k < word.length && isMark(word[k])) k++;
      return k;
    })
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((x, y) => x - y);
  const spans: [number, number][] = [];
  for (let i = 0; i < fixed.length - 1; i++) if (fixed[i] < fixed[i + 1]) spans.push([fixed[i], fixed[i + 1]]);
  const texts = joinSafeSegments(spans.map(([a, b]) => word.slice(a, b)));
  return spans.map(([a, b], i) => ({
    text: texts[i],
    start: a,
    end: b,
    focus: ranges.some(([x, y]) => a >= x && a < y),
  }));
}

export type Position = 'isolated' | 'initial' | 'medial' | 'final';

/**
 * A letter shown in one of its four positional forms, for labels in LetterForms. Uses ZWJ around the
 * base letter rather than presentation-form code points, so text stays as base letters and the font
 * shapes it. Non-joining letters have no initial or medial form of their own and come back as-is.
 */
export function letterForm(letter: string, position: Position): string {
  const left = joinsLeft(letter);
  switch (position) {
    case 'isolated':
      return letter;
    case 'initial':
      return left ? letter + ZWJ : letter;
    case 'medial':
      return left ? ZWJ + letter + ZWJ : ZWJ + letter;
    case 'final':
      return ZWJ + letter;
  }
}
