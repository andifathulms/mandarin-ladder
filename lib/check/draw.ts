import type { CheckItem } from '../types';
import type { ProgressState } from '../progress/types';
import { rng, shuffle } from './random';

/** Draws n test items deterministically from the seed, with at least one item from every lesson. */
export function drawTest(pool: CheckItem[], seed: number, n = 16): CheckItem[] {
  const rand = rng(seed);
  const byLesson = new Map<string, CheckItem[]>();
  for (const item of pool) {
    const k = item.from ?? '';
    byLesson.set(k, [...(byLesson.get(k) ?? []), item]);
  }
  const picked: CheckItem[] = [];
  const rest: CheckItem[] = [];
  for (const k of [...byLesson.keys()].sort()) {
    const [first, ...others] = shuffle(byLesson.get(k)!, rand);
    picked.push(first);
    rest.push(...others);
  }
  const fill = shuffle(rest, rand).slice(0, Math.max(0, n - picked.length));
  return shuffle([...picked.slice(0, n), ...fill], rand);
}

/** Up to n review items from completed lessons: box 1 first, then 2, then 3; ties by oldest lastSeen. */
export function drawReview(
  progress: ProgressState,
  items: { item: CheckItem; lessonId: string }[],
  n = 5,
): CheckItem[] {
  return items
    .filter(({ lessonId }) => progress.lessons[lessonId]?.completed)
    .map(({ item }) => ({ item, p: progress.items[item.id] }))
    .sort((a, b) => (a.p?.box ?? 1) - (b.p?.box ?? 1) || (a.p?.lastSeen ?? 0) - (b.p?.lastSeen ?? 0))
    .slice(0, n)
    .map((x) => x.item);
}
