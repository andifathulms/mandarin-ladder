import { describe, expect, it } from 'vitest';
import { compare, grade, matchOf, sameOrder } from '@/lib/check/grade';
import { drawReview, drawTest } from '@/lib/check/draw';
import { nextBox } from '@/lib/check/leitner';
import { emptyState } from '@/lib/progress/defaults';
import type { CheckItem } from '@/lib/types';

const why = { id: 'x', en: 'y' };

describe('grade', () => {
  it('grades choice, gap, scene and fix by exact option', () => {
    const c: CheckItem = { id: 'a', type: 'choice', prompt: 'p', options: ['in', 'on'], answer: 'on', why };
    expect(grade(c, 'on').correct).toBe(true);
    expect(grade(c, 'in').correct).toBe(false);
    expect(grade(c, ['on']).correct).toBe(false);
    const f: CheckItem = { id: 'b', type: 'fix', wrong: 'She have', options: ['She [[has]] two cats.', 'x'], answer: 'She [[has]] two cats.', why };
    expect(grade(f, 'She has two cats.').correct).toBe(true);
  });

  it('grades listen items by the option chosen, not the audio text', () => {
    const l: CheckItem = { id: 'l', type: 'listen', variety: 'fusha', audio: 'The doctors are busy.', options: ['The doctors are busy.', 'The doctor is busy.'], answer: 'The doctors are busy.', why };
    expect(grade(l, 'The doctors are busy.').correct).toBe(true);
    expect(grade(l, 'The doctor is busy.').correct).toBe(false);
  });

  it('grades order against answer and accept alternatives', () => {
    const o: CheckItem = {
      id: 'c',
      type: 'order',
      tiles: ['I', 'am', 'tired', "I'm"],
      answer: ['I', 'am', 'tired'],
      accept: [["I'm", 'tired']],
      why,
    };
    expect(grade(o, ['I', 'am', 'tired']).correct).toBe(true);
    expect(grade(o, ["I'm", 'tired.']).correct).toBe(true);
    expect(grade(o, ['am', 'I', 'tired']).correct).toBe(false);
  });

  it('order comparison has no case rule and ignores trailing punctuation in both scripts', () => {
    expect(sameOrder(['the', 'ball'], ['The', 'ball'])).toBe(true);
    expect(sameOrder(['The', 'ball?'], ['The', 'ball'])).toBe(true);
    expect(sameOrder(['هٰذَا', 'كِتَابٌ.'], ['هٰذَا', 'كِتَابٌ'])).toBe(true);
    expect(sameOrder(['مَا', 'هٰذَا؟'], ['مَا', 'هٰذَا'])).toBe(true);
    expect(sameOrder(['كِتَابٌ', 'هٰذَا'], ['هٰذَا', 'كِتَابٌ'])).toBe(false);
  });
});

describe('Arabic grading', () => {
  it('exact keeps harakat; loose ignores harakat and hamza seats', () => {
    expect(compare('كِتَابٌ', 'كتاب', 'loose')).toBe(true);
    expect(compare('كِتَابٌ', 'كتاب', 'exact')).toBe(false);
    expect(compare('إِلَى', 'الي', 'loose')).toBe(true);
    expect(compare('بَ', 'بِ', 'exact')).toBe(false);
    expect(compare('كِتَابٌ', 'كِتَابٌ', 'exact')).toBe(true);
  });
  it('normalises Arabic punctuation and tatweel', () => {
    expect(compare('ما هذا؟', 'ما هـذا?', 'exact')).toBe(true);
  });
  it('never lets a harakat-only difference pass in a loose item', () => {
    const c: CheckItem = { id: 'h', type: 'choice', prompt: 'p', options: ['بَ', 'بِ', 'بُ'], answer: 'بِ', why };
    expect(matchOf(c)).toBe('exact');
    expect(grade(c, 'بَ').correct).toBe(false);
    expect(grade(c, 'بِ').correct).toBe(true);
  });
  it('treats transliteration options as Latin: case-insensitive, ʿ ʾ and apostrophes equal', () => {
    const r: CheckItem = { id: 'r', type: 'read', ar: 'سَأَلَ', options: ['saʾala', 'salla'], answer: 'saʾala', why };
    expect(grade(r, 'saʾala').correct).toBe(true);
    expect(compare("Sa'ala", 'saʾala')).toBe(true);
    expect(grade(r, 'salla').correct).toBe(false);
  });
  it('grades spell by the joined, normalised letters', () => {
    const s: CheckItem = { id: 's', type: 'spell', letters: ['ك', 'ت', 'ا', 'ب'], distractors: ['ن'], answer: 'كتاب', why };
    expect(grade(s, ['ك', 'ت', 'ا', 'ب']).correct).toBe(true);
    expect(grade(s, 'كتاب').correct).toBe(true);
    expect(grade(s, ['ك', 'ا', 'ت', 'ب']).correct).toBe(false);
  });
  it('grades mark by the mark name', () => {
    const m: CheckItem = { id: 'm', type: 'mark', ar: 'دَرْسٌ', target: 1, options: ['fatha', 'sukun', 'kasra'], answer: 'sukun', why };
    expect(grade(m, 'sukun').correct).toBe(true);
    expect(grade(m, 'fatha').correct).toBe(false);
  });
});

describe('drawTest', () => {
  const pool: CheckItem[] = Array.from({ length: 24 }, (_, i) => ({
    id: `t${i}`,
    type: 'choice',
    prompt: 'p',
    options: ['a', 'b'],
    answer: 'a',
    why,
    from: `L${i % 8}`,
  }));

  it('is deterministic for a seed and returns n unique items', () => {
    const a = drawTest(pool, 42);
    const b = drawTest(pool, 42);
    expect(a.map((x) => x.id)).toEqual(b.map((x) => x.id));
    expect(new Set(a.map((x) => x.id)).size).toBe(16);
  });

  it('differs between seeds', () => {
    expect(drawTest(pool, 1).map((x) => x.id)).not.toEqual(drawTest(pool, 2).map((x) => x.id));
  });

  it('includes at least one item from every lesson', () => {
    for (const seed of [1, 7, 99, 12345]) {
      const lessons = new Set(drawTest(pool, seed).map((x) => x.from));
      expect(lessons.size).toBe(8);
    }
  });
});

describe('drawReview and Leitner', () => {
  it('moves boxes: miss → 1, correct → up one, max 3', () => {
    expect(nextBox(undefined, false)).toBe(1);
    expect(nextBox(undefined, true)).toBe(2);
    expect(nextBox(2, true)).toBe(3);
    expect(nextBox(3, true)).toBe(3);
    expect(nextBox(3, false)).toBe(1);
  });

  it('draws box 1 first, then by oldest lastSeen, from completed lessons only', () => {
    const p = emptyState();
    p.lessons = {
      L1: { step: 5, furthest: 5, completed: true, lastOpened: 0 },
      L2: { step: 2, furthest: 2, completed: false, lastOpened: 0 },
    };
    p.items = {
      a: { firstTry: true, box: 3, lastSeen: 1 },
      b: { firstTry: false, box: 1, lastSeen: 50 },
      c: { firstTry: true, box: 2, lastSeen: 5 },
      d: { firstTry: false, box: 1, lastSeen: 10 },
    };
    const mk = (id: string, lessonId: string) => ({
      lessonId,
      item: { id, type: 'choice', prompt: 'p', options: ['a', 'b'], answer: 'a', why } as CheckItem,
    });
    const drawn = drawReview(p, [mk('a', 'L1'), mk('b', 'L1'), mk('c', 'L1'), mk('d', 'L1'), mk('e', 'L2')], 3);
    expect(drawn.map((x) => x.id)).toEqual(['d', 'b', 'c']);
  });
});

import { placementResult, scorePlacement } from '@/lib/check/placement';
import type { Placement } from '@/lib/types';

describe('placement scoring', () => {
  const th = { easy1: 18, huruf2: 14 };
  it('places by thresholds', () => {
    expect(placementResult(20, th)).toBe('easy-1');
    expect(placementResult(18, th)).toBe('easy-1');
    expect(placementResult(17, th)).toBe('huruf-2');
    expect(placementResult(14, th)).toBe('huruf-2');
    expect(placementResult(13, th)).toBe('huruf-1');
  });
  it('scores by section and collects the lessons behind misses', () => {
    const mk = (i: number, section: 'forms' | 'reading' | 'harakat' | 'sounds', from?: string): CheckItem => ({
      id: `p${i}`,
      type: 'choice',
      match: 'exact',
      section,
      from,
      prompt: 'x',
      options: ['بَ', 'بِ'],
      answer: 'بَ',
      why,
    });
    const items = [mk(1, 'forms', 'a'), mk(2, 'reading', 'b'), mk(3, 'harakat', 'b'), mk(4, 'sounds', 'c')];
    const p = { items, thresholds: { easy1: 4, huruf2: 3 } } as unknown as Placement;
    const s = scorePlacement(p, { p1: 'بَ', p2: 'بِ', p3: 'بِ', p4: 'بَ' });
    expect(s.score).toBe(2);
    expect(s.bySection.reading).toEqual({ score: 0, total: 1 });
    expect(s.missed).toEqual(['b']);
    expect(s.result).toBe('huruf-1');
  });
});
