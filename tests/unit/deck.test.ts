import { describe, expect, it } from 'vitest';
import { dayNumber, INTERVALS, newOrder, plan, review, teach, type DeckCardState } from '@/lib/deck/schedule';

const cards = Array.from({ length: 40 }, (_, i) => ({ id: `w${i}` }));

describe('Leitner deck', () => {
  it('uses the fixed intervals 1, 2, 4, 8, 16', () => {
    expect(Object.values(INTERVALS)).toEqual([1, 2, 4, 8, 16]);
  });
  it('moves up a box when remembered and back to 1 when not', () => {
    let s = review(undefined, true, 100);
    expect(s).toMatchObject({ box: 2, due: 102, first: 100 });
    s = review(s, true, 102);
    expect(s).toMatchObject({ box: 3, due: 106, first: 100 });
    for (const d of [106, 110, 120, 140]) s = review(s, true, d);
    expect(s.box).toBe(5);
    expect(s.due).toBe(156);
    s = review(s, false, 156);
    expect(s).toMatchObject({ box: 1, due: 157 });
  });
  it('adds taught words as learned, due tomorrow, keeping existing progress', () => {
    expect(teach(undefined, 10)).toMatchObject({ box: 1, due: 11, learned: true, lastSeen: 0 });
    const s: DeckCardState = { box: 4, due: 30, learned: false, lastSeen: 5, first: 2 };
    expect(teach(s, 10)).toMatchObject({ box: 4, due: 30, learned: true });
  });
  it('orders new cards the same way every time', () => {
    expect(newOrder(cards, 'easy-1').map((c) => c.id)).toEqual(newOrder(cards, 'easy-1').map((c) => c.id));
    expect(newOrder(cards, 'easy-1').map((c) => c.id)).not.toEqual(cards.map((c) => c.id));
  });
  it('plans due cards and the daily new allowance', () => {
    const state: Record<string, DeckCardState> = {
      w1: { box: 2, due: 50, learned: false, lastSeen: 1, first: 40 },
      w2: { box: 1, due: 49, learned: false, lastSeen: 1, first: 40 },
      w3: { box: 3, due: 60, learned: false, lastSeen: 1, first: 40 },
      w4: { box: 1, due: 51, learned: true, lastSeen: 0, first: 50 },
    };
    const p = plan(cards, state, 50, 5, 'easy-1');
    expect(p.due.map((c) => c.id)).toEqual(['w2', 'w1']);
    expect(p.fresh).toHaveLength(5);
    expect(p.fresh[0].id).toBe('w4');
    // Cards started today count against the allowance.
    state.w5 = { box: 2, due: 52, learned: false, lastSeen: 9, first: 50 };
    expect(plan(cards, state, 50, 5, 'easy-1').fresh).toHaveLength(4);
  });
  it('counts days by the local calendar', () => {
    expect(dayNumber(new Date(2026, 9, 16, 23, 59))).toBe(dayNumber(new Date(2026, 9, 16, 0, 1)));
    expect(dayNumber(new Date(2026, 9, 17))).toBe(dayNumber(new Date(2026, 9, 16)) + 1);
  });
});
