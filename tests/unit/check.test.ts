import { describe, expect, it } from 'vitest';
import { compare, grade, parseTones, sameOrder } from '@/lib/check/grade';
import { drawReview, drawTest } from '@/lib/check/draw';
import { nextBox } from '@/lib/check/leitner';
import { emptyState } from '@/lib/progress/defaults';
import type { CheckItem } from '@/lib/types';

const why = { id: 'x', en: 'y' };

describe('grade', () => {
  it('grades choice, gap, scene and fix by the option chosen', () => {
    const c: CheckItem = { id: 'a', type: 'choice', prompt: 'p', options: ['meja', 'kursi'], answer: 'meja', why };
    expect(grade(c, 'meja').correct).toBe(true);
    expect(grade(c, 'Meja').correct).toBe(true);
    expect(grade(c, 'kursi').correct).toBe(false);
    expect(grade(c, ['meja']).correct).toBe(false);
    const f: CheckItem = { id: 'b', type: 'fix', wrong: '我 是 忙 。', options: ['我 [[很]] 忙 。', '我 是 很 忙 。'], answer: '我 [[很]] 忙 。', why };
    expect(grade(f, '我很忙。').correct).toBe(true);
    expect(grade(f, '我是很忙。').correct).toBe(false);
  });

  it('compares Chinese with normZh: spaces, markup and punctuation width do not matter', () => {
    expect(compare('你好 ，我 是 Rina 。', '你好,我是Rina.')).toBe(true);
    expect(compare('书 在 桌子 [[上]]', '书在桌子上')).toBe(true);
    expect(compare('书在桌子上', '书在桌子下')).toBe(false);
  });

  it('grades listen items by the option chosen, not the audio text', () => {
    const l: CheckItem = { id: 'l', type: 'listen', audio: '我 很 忙 。', options: ['Aku sibuk.', 'Aku lapar.'], answer: 'Aku sibuk.', why };
    expect(grade(l, 'Aku sibuk.').correct).toBe(true);
    expect(grade(l, 'Aku lapar.').correct).toBe(false);
  });

  it('grades order against answer and accept alternatives, joined without spaces', () => {
    const o: CheckItem = { id: 'c', type: 'order', tiles: ['我', '明天', '去', '北京'], answer: ['我', '明天', '去', '北京'], accept: [['明天', '我', '去', '北京']], why };
    expect(grade(o, ['我', '明天', '去', '北京']).correct).toBe(true);
    expect(grade(o, ['明天', '我', '去', '北京。']).correct).toBe(true);
    expect(grade(o, ['我', '去', '北京', '明天']).correct).toBe(false);
  });

  it('order comparison ignores trailing punctuation of either width', () => {
    expect(sameOrder(['你', '好。'], ['你', '好'])).toBe(true);
    expect(sameOrder(['你', '好.'], ['你', '好'])).toBe(true);
    expect(sameOrder(['好', '你'], ['你', '好'])).toBe(false);
  });
});

describe('Mandarin item types', () => {
  it('tone compares sequences, in any input form', () => {
    const t: CheckItem = { id: 't', type: 'tone', audio: '你好', audio_py: 'nǐhǎo', ask: 'spoken', options: [[3, 3], [2, 3]], answer: [2, 3], why };
    expect(grade(t, '2,3').correct).toBe(true);
    expect(grade(t, ['2', '3']).correct).toBe(true);
    expect(grade(t, '3,3').correct).toBe(false);
    expect(grade(t, '2').correct).toBe(false);
  });

  it('pinyin accepts tone numbers or marks, v or u: for ü, and accept alternatives', () => {
    const p: CheckItem = { id: 'p', type: 'pinyin', audio: 'syl-lv4', answer: 'lǜ', why };
    expect(grade(p, 'lv4').correct).toBe(true);
    expect(grade(p, 'lu:4').correct).toBe(true);
    expect(grade(p, 'LǛ').correct).toBe(true);
    expect(grade(p, 'lu4').correct).toBe(false);
    const x: CheckItem = { id: 'x', type: 'pinyin', audio: '谢谢', answer: 'xièxie', accept: ['xièxiè'], why };
    expect(grade(x, 'xie4 xie5').correct).toBe(true);
    expect(grade(x, 'xie4xie4').correct).toBe(true);
    expect(grade(x, 'xie3xie5').correct).toBe(false);
  });

  it('build compares the chosen parts as a set', () => {
    const b: CheckItem = { id: 'b', type: 'build', char: '好', parts: ['女', '子', '马', '口'], answer: ['女', '子'], why };
    expect(grade(b, ['子', '女']).correct).toBe(true);
    expect(grade(b, ['女', '马']).correct).toBe(false);
    expect(grade(b, ['女']).correct).toBe(false);
  });

  it('trace passes with two misses or fewer (CLAUDE.md §7.5)', () => {
    const tr: CheckItem = { id: 'tr', type: 'trace', char: '人', guide: 'on', why };
    expect(grade(tr, 'misses:0').correct).toBe(true);
    expect(grade(tr, 'misses:2').correct).toBe(true);
    expect(grade(tr, 'misses:3').correct).toBe(false);
    expect(grade(tr, 'nonsense').correct).toBe(false);
  });

  it('parses tone responses', () => {
    expect(parseTones('3 + 3')).toEqual([3, 3]);
    expect(parseTones(['2', '0'])).toEqual([2, 0]);
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
  const th = { easy1: 17, dasar2: 12 };
  it('places by thresholds (PRD §5.2: 17+, 12–16, under 12)', () => {
    expect(placementResult(20, th)).toBe('easy-1');
    expect(placementResult(17, th)).toBe('easy-1');
    expect(placementResult(16, th)).toBe('dasar-2');
    expect(placementResult(12, th)).toBe('dasar-2');
    expect(placementResult(11, th)).toBe('dasar-1');
  });
  it('scores by section and collects the lessons behind misses', () => {
    const mk = (i: number, section: 'tones' | 'pinyin' | 'sandhi' | 'radicals', from?: string): CheckItem => ({
      id: `p${i}`,
      type: 'choice',
      section,
      from,
      prompt: 'x',
      options: ['a', 'b'],
      answer: 'a',
      why,
    });
    const items = [mk(1, 'tones', 'a'), mk(2, 'pinyin', 'b'), mk(3, 'sandhi', 'b'), mk(4, 'radicals', 'c')];
    const p = { items, thresholds: { easy1: 4, dasar2: 3 } } as unknown as Placement;
    const s = scorePlacement(p, { p1: 'a', p2: 'b', p3: 'b', p4: 'a' });
    expect(s.score).toBe(2);
    expect(s.bySection.pinyin).toEqual({ score: 0, total: 1 });
    expect(s.missed).toEqual(['b']);
    expect(s.result).toBe('dasar-1');
  });
});
