import type { CheckItem } from '../types';
import { stripMarkup } from '../markup';
import { hasArabic, looseKey, normalise, translitKey } from '../arabic';

export type Response = string | string[];
export type Match = 'exact' | 'loose';

const trimPunct = (s: string) => s.replace(/[.,!?;:،؛؟]+$/u, '');

/**
 * Compares two answers (CLAUDE.md §7.3). Arabic: exact → normalised text with harakat;
 * loose → no harakat, unified alef/hamza seats. Latin (transliteration or Indonesian):
 * case-insensitive, ʿ ʾ and apostrophes equal.
 */
export function compare(a: string, b: string, match: Match = 'loose'): boolean {
  const x = stripMarkup(a);
  const y = stripMarkup(b);
  if (!hasArabic(x) && !hasArabic(y)) return translitKey(x) === translitKey(y);
  return match === 'exact' ? normalise(x) === normalise(y) : looseKey(x) === looseKey(y);
}

/** Token-by-token comparison for order items. No case rule; trailing punctuation ignored in both scripts. */
export function sameOrder(given: string[], expected: string[], match: Match = 'loose'): boolean {
  const norm = (a: string[]) => a.map((w) => trimPunct(w.trim())).filter(Boolean);
  const g = norm(given);
  const e = norm(expected);
  if (g.length !== e.length) return false;
  return g.every((w, i) => compare(w, e[i], match));
}

/**
 * The match mode for an item. Loose is the default, but an item whose options differ only in
 * harakat or hamza seats is always graded exactly, so a wrong option can never pass as right.
 */
export function matchOf(item: CheckItem): Match {
  const declared = (item as { match?: Match }).match ?? 'loose';
  if (declared === 'exact') return 'exact';
  const opts = 'options' in item ? item.options : [];
  const keys = opts.filter(hasArabic).map(looseKey);
  return new Set(keys).size < keys.length ? 'exact' : 'loose';
}

export function grade(item: CheckItem, response: Response): { correct: boolean } {
  const match = matchOf(item);
  switch (item.type) {
    case 'order':
      if (!Array.isArray(response)) return { correct: false };
      return { correct: [item.answer, ...(item.accept ?? [])].some((a) => sameOrder(response, a, match)) };
    case 'spell': {
      const joined = Array.isArray(response) ? response.join('') : response;
      return { correct: normalise(joined) === normalise(item.answer) };
    }
    case 'mark':
      return { correct: typeof response === 'string' && response === item.answer };
    default:
      if (typeof response !== 'string') return { correct: false };
      return { correct: compare(response, item.answer, match) };
  }
}
