// Word-deck scheduling (CLAUDE.md §7.4, PRD §5.8): five Leitner boxes with fixed intervals of 1, 2, 4,
// 8 and 16 days. Deterministic: the only randomness is the seeded order of new cards.
import { rng, shuffle } from '../check/random';

export type DeckBox = 1 | 2 | 3 | 4 | 5;
export type DeckCardState = {
  box: DeckBox;
  /** Day number when the card is next due. */
  due: number;
  /** Taught in a completed lesson (dipelajari). */
  learned: boolean;
  /** Last review, ms since epoch. */
  lastSeen: number;
  /** Day number of the first review, for the daily new-card count. */
  first: number;
};

export const INTERVALS: Record<DeckBox, number> = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };

/** Days since 1970-01-01 for the local calendar date. */
export function dayNumber(d = new Date()): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/**
 * The next state after a review. "Ingat" moves a card up one box (a new card starts at box 2) and
 * schedules it after that box's interval; "Belum ingat" sends it to box 1, due tomorrow.
 */
export function review(prev: DeckCardState | undefined, remembered: boolean, today: number, now = Date.now()): DeckCardState {
  const box: DeckBox = remembered ? (Math.min((prev?.box ?? 1) + 1, 5) as DeckBox) : 1;
  return {
    box,
    due: today + INTERVALS[box],
    learned: prev?.learned ?? false,
    lastSeen: now,
    first: prev?.first ?? today,
  };
}

/** A lesson taught the word: it joins the deck as learned, due tomorrow, unless it is already there. */
export function teach(prev: DeckCardState | undefined, today: number): DeckCardState {
  if (prev) return { ...prev, learned: true };
  return { box: 1, due: today + 1, learned: true, lastSeen: 0, first: today };
}

/** The fixed, seeded order of new cards for a deck (stable across visits). */
export function newOrder<T extends { id: string }>(cards: T[], seed: string): T[] {
  const s = [...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 17);
  return shuffle(cards, rng(s));
}

export type DeckPlan<T> = { due: T[]; fresh: T[] };

/**
 * Today's session: up to 20 due cards (oldest due first, then lower boxes), and new cards up to the
 * daily allowance less the new cards already started today. Learned cards from lessons come first
 * among the new ones (they are new to the deck, not to the learner).
 */
export function plan<T extends { id: string }>(cards: T[], state: Record<string, DeckCardState>, today: number, daily: number, seed: string, maxDue = 20): DeckPlan<T> {
  const due = cards
    .filter((c) => state[c.id] && state[c.id].due <= today && state[c.id].lastSeen > 0)
    .sort((a, b) => state[a.id].due - state[b.id].due || state[a.id].box - state[b.id].box)
    .slice(0, maxDue);
  const startedToday = Object.values(state).filter((s) => s.first === today && s.lastSeen > 0).length;
  const left = Math.max(0, daily - startedToday);
  const unseen = cards.filter((c) => !state[c.id] || state[c.id].lastSeen === 0);
  const learnedFirst = [...unseen.filter((c) => state[c.id]?.learned), ...newOrder(unseen.filter((c) => !state[c.id]?.learned), seed)];
  return { due, fresh: learnedFirst.slice(0, left) };
}
