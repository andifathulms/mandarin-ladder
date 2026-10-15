import { parseInline } from '../markup';
import { joinSafeSegments } from './join';
import { stripHarakat, tokenise } from './text';

export type HarakatLevel = 'full' | 'partial' | 'none';

export type Piece = {
  text: string;
  focus: boolean;
  /** Index of the spoken word this piece belongs to (as tokenise counts them), or -1 for spaces. */
  word: number;
};

/**
 * Splits an authored Arabic string ([[focus]] markup, fully vowelled) into render pieces at focus and
 * word boundaries, applies the harakat level, and adds ZWJ wherever a piece boundary falls inside a
 * joined word (CLAUDE.md §6.5, §7.2).
 */
export function displayPieces(src: string, level: HarakatLevel = 'full'): Piece[] {
  const toks = parseInline(src);
  const plain = toks.map((t) => t.v).join('');
  const words = tokenise(plain);
  const wordAt = (offset: number) => words.findIndex((w) => offset >= w.start && offset < w.end);
  const pieces: Piece[] = [];
  let pos = 0;
  for (const tok of toks) {
    const focus = tok.t === 'focus';
    for (const part of tok.v.split(/(\s+)/)) {
      if (!part) continue;
      const space = /^\s+$/.test(part);
      let text = part;
      if (!space && level === 'none') text = stripHarakat(part);
      if (!space && level === 'partial' && !focus) text = stripHarakat(part, { shadda: true, tanwin: true });
      pieces.push({ text, focus, word: space ? -1 : wordAt(pos) });
      pos += part.length;
    }
  }
  const joined = joinSafeSegments(pieces.map((p) => p.text));
  return pieces.map((p, i) => ({ ...p, text: joined[i] }));
}
