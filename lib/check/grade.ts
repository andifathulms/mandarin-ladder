import type { CheckItem } from '../types';
import { stripMarkup } from '../markup';
import { hasHan, normZh } from '../zh/text';
import { samePinyin } from '../zh/pinyin';

export type Response = string | string[];

const trimPunct = (s: string) => s.replace(/[，。！？、：；,.!?;:]+$/u, '');

/**
 * Compares two answers (CLAUDE.md §7.3). Chinese: normZh equality (full-width punctuation unified,
 * spaces and markup removed). Latin (Indonesian, English, pinyin options): case-insensitive, trimmed.
 */
export function compare(a: string, b: string): boolean {
  const x = stripMarkup(a);
  const y = stripMarkup(b);
  if (hasHan(x) || hasHan(y)) return normZh(x) === normZh(y);
  return x.trim().toLowerCase().normalize('NFC') === y.trim().toLowerCase().normalize('NFC');
}

/** Token-by-token comparison for order items; trailing punctuation ignored. No case rule. */
export function sameOrder(given: string[], expected: string[]): boolean {
  const norm = (a: string[]) => a.map((w) => trimPunct(normZh(w))).filter(Boolean);
  const g = norm(given);
  const e = norm(expected);
  if (g.length !== e.length) return false;
  return g.every((w, i) => w === e[i]);
}

/** "3,3" or "3+3" → [3, 3]. */
export const parseTones = (r: Response): number[] =>
  (Array.isArray(r) ? r : r.split(/[\s,+]+/)).filter((x) => x !== '').map((x) => Number(x));

/** Trace responses carry the misses: "misses:1". Two or fewer total misses is correct (CLAUDE.md §7.5). */
export const TRACE_PASS_MISSES = 2;
export const traceMisses = (r: Response): number => {
  const m = /^misses:(\d+)$/.exec(Array.isArray(r) ? r.join('') : r);
  return m ? Number(m[1]) : Infinity;
};

export function grade(item: CheckItem, response: Response): { correct: boolean } {
  switch (item.type) {
    case 'order':
      if (!Array.isArray(response)) return { correct: false };
      return { correct: [item.answer, ...(item.accept ?? [])].some((a) => sameOrder(response, a)) };
    case 'tone': {
      const t = parseTones(response);
      return { correct: t.length === item.answer.length && t.every((x, i) => x === item.answer[i]) };
    }
    case 'pinyin': {
      const r = Array.isArray(response) ? response.join(' ') : response;
      return { correct: [item.answer, ...(item.accept ?? [])].some((a) => samePinyin(r, a)) };
    }
    case 'trace':
      return { correct: traceMisses(response) <= TRACE_PASS_MISSES };
    case 'build': {
      if (!Array.isArray(response)) return { correct: false };
      const want = [...item.answer].sort().join('|');
      return { correct: [...response].sort().join('|') === want };
    }
    default:
      if (typeof response !== 'string') return { correct: false };
      return { correct: compare(response, item.answer) };
  }
}
