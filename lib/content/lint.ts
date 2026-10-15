import type { Lesson, Rung } from '../types';

export type Finding = { level: 'error' | 'warn'; message: string };

/**
 * Content lint (CLAUDE.md §6). The Mandarin rules (HSK lists, grammar inventory, characters,
 * pinyin, reviewers) arrive with the Mandarin content model; until then there is nothing to check.
 */
export function lintLessons(_rungs: Rung[], _byRung: Map<string, Lesson[]>): Finding[] {
  return [];
}
