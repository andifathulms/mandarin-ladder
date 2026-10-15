import type { LessonSummary, Quote, Rung } from '../types';
import type { ProgressState } from './types';
import { todayKey } from './store';

export type LessonState =
  | { kind: 'new' }
  | { kind: 'progress'; step: number }
  | { kind: 'done' }
  | { kind: 'review'; n: number };

export function missedCount(l: LessonSummary, p: ProgressState): number {
  return l.checkIds.filter((id) => p.items[id]?.firstTry === false).length;
}

export function lessonState(l: LessonSummary, p: ProgressState): LessonState {
  const lp = p.lessons[l.id];
  if (!lp) return { kind: 'new' };
  if (lp.completed) {
    const n = missedCount(l, p);
    return n ? { kind: 'review', n } : { kind: 'done' };
  }
  return { kind: 'progress', step: lp.step };
}

export type RungState =
  | { kind: 'soon' }
  | { kind: 'climbed' }
  | { kind: 'progress'; done: number }
  | { kind: 'new' };

export function doneCount(rungId: string, lessons: LessonSummary[], p: ProgressState): number {
  return lessons.filter((l) => l.rung === rungId && p.lessons[l.id]?.completed).length;
}

export function rungState(r: Rung, lessons: LessonSummary[], p: ProgressState): RungState {
  if (r.status === 'soon') return { kind: 'soon' };
  if (p.rungs[r.id]?.climbed) return { kind: 'climbed' };
  const done = doneCount(r.id, lessons, p);
  const touched = lessons.some((l) => l.rung === r.id && p.lessons[l.id]);
  return touched ? { kind: 'progress', done } : { kind: 'new' };
}

/**
 * The rung the learner is on: the first live rung not yet climbed, else the last live one.
 * Optional rungs (Starter) are skipped; a learner working in one continues there via continueTarget.
 */
export function currentRung(rungs: Rung[], p: ProgressState): Rung {
  const live = rungs.filter((r) => r.status === 'live' && !r.optional);
  return live.find((r) => !p.rungs[r.id]?.climbed) ?? live[live.length - 1] ?? rungs[0];
}

export type ContinueTarget =
  | { kind: 'welcome' }
  | { kind: 'lesson'; lesson: LessonSummary; step: number; text: Quote }
  | { kind: 'test'; rung: Rung };

export function continueTarget(
  rungs: Rung[],
  lessons: LessonSummary[],
  p: ProgressState,
): ContinueTarget {
  const started = Object.keys(p.lessons).length > 0;
  if (!started) {
    // After the placement check, start at the placed rung's first lesson.
    const placed = p.placement && rungs.find((r) => r.id === p.placement!.result);
    const first = placed && lessons.filter((l) => l.rung === placed.id).sort((a, b) => a.order - b.order)[0];
    if (first) return { kind: 'lesson', lesson: first, step: 0, text: first.resume[0] };
    return { kind: 'welcome' };
  }

  const known = lessons.filter((l) => p.lessons[l.id]);
  const recent = known.sort((a, b) => p.lessons[b.id].lastOpened - p.lessons[a.id].lastOpened)[0];
  if (recent && !p.lessons[recent.id].completed) {
    const lp = p.lessons[recent.id];
    const text =
      lp.step === 4 && lp.checkIndex !== undefined
        ? (recent.checkTexts[lp.checkIndex] ?? recent.resume[4])
        : recent.resume[lp.step];
    return { kind: 'lesson', lesson: recent, step: lp.step, text };
  }

  // Stay in the rung of the last lesson while it has unfinished lessons, else move to the current rung.
  const recentRung = recent && rungs.find((r) => r.id === recent.rung);
  const unfinished = (id: string) => lessons.some((l) => l.rung === id && !p.lessons[l.id]?.completed);
  const rung =
    recentRung && !p.rungs[recentRung.id]?.climbed && unfinished(recentRung.id) ? recentRung : currentRung(rungs, p);
  const inRung = lessons.filter((l) => l.rung === rung.id).sort((a, b) => a.order - b.order);
  const after = recent && recent.rung === rung.id ? inRung.filter((l) => l.order > recent.order) : inRung;
  const next =
    after.find((l) => !p.lessons[l.id]?.completed) ?? inRung.find((l) => !p.lessons[l.id]?.completed);
  if (next) return { kind: 'lesson', lesson: next, step: 0, text: next.resume[0] };
  if (rung.status === 'live' && !p.rungs[rung.id]?.climbed) return { kind: 'test', rung };
  return { kind: 'welcome' };
}

/** Monday-first days of the current week with practised flags. */
export function weekDays(p: ProgressState, now = new Date()): { key: string; practised: boolean; today: boolean }[] {
  const monday = new Date(now);
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const set = new Set(p.days);
  const today = todayKey(now);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = todayKey(d);
    return { key, practised: set.has(key), today: key === today };
  });
}

export function completedCount(lessons: LessonSummary[], p: ProgressState): number {
  return lessons.filter((l) => p.lessons[l.id]?.completed).length;
}
