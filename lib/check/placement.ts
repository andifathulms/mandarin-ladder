import type { CheckItem, Placement } from '../types';
import type { PlacementResult } from '../progress/types';
import { grade, type Response } from './grade';

export const SECTIONS = ['tones', 'pinyin', 'sandhi', 'strokes', 'radicals', 'chars'] as const;
export type Section = (typeof SECTIONS)[number];

export type PlacementScore = {
  score: number;
  total: number;
  bySection: Record<Section, { score: number; total: number }>;
  result: PlacementResult;
  /** Lesson ids behind missed items (deduplicated). */
  missed: string[];
};

/** 17+ → Easy 1; 12–16 → Dasar 2; under 12 → Dasar 1 (PRD §5.2). */
export function placementResult(score: number, t: Placement['thresholds']): PlacementResult {
  if (score >= t.easy1) return 'easy-1';
  if (score >= t.dasar2) return 'dasar-2';
  return 'dasar-1';
}

export function scorePlacement(p: Placement, answers: Record<string, Response | undefined>): PlacementScore {
  const bySection = Object.fromEntries(SECTIONS.map((s) => [s, { score: 0, total: 0 }])) as PlacementScore['bySection'];
  const missed: string[] = [];
  let score = 0;
  for (const item of p.items as CheckItem[]) {
    const sec = (item.section ?? 'tones') as Section;
    bySection[sec].total += 1;
    const a = answers[item.id];
    const ok = a !== undefined && grade(item, a).correct;
    if (ok) {
      score += 1;
      bySection[sec].score += 1;
    } else if (item.from && !missed.includes(item.from)) missed.push(item.from);
  }
  return { score, total: p.items.length, bySection, result: placementResult(score, p.thresholds), missed };
}
