import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as store from '@/lib/progress/store';
import { migrate, MigrationError } from '@/lib/progress/migrations';
import { STORAGE_KEY, SCHEMA_VERSION } from '@/lib/progress/constants';
import { continueTarget, currentRung, lessonState, weekDays } from '@/lib/progress/derive';
import { emptyState } from '@/lib/progress/defaults';
import type { LessonSummary, Rung } from '@/lib/types';

beforeEach(() => {
  localStorage.clear();
  store.__resetForTests();
});

describe('migrations', () => {
  it('upgrades unversioned state and fills defaults', () => {
    const s = migrate({ lessons: { a: { step: 2, furthest: 2, completed: false, lastOpened: 1 } } });
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.lessons.a.step).toBe(2);
    expect(s.settings.uiLang).toBe('id');
  });
  it('drops invalid settings values', () => {
    expect(migrate({ schemaVersion: 1, settings: { theme: 'neon', textSize: 115 } }).settings).toMatchObject({ theme: 'light', textSize: 115 });
  });
  it('refuses newer versions and non-objects', () => {
    expect(() => migrate({ schemaVersion: 99 })).toThrow(MigrationError);
  });

  it('keeps theme choices and rejects non-objects', () => {
    expect(migrate({ schemaVersion: 1, settings: { theme: 'system' } }).settings.theme).toBe('system');
    expect(migrate({ schemaVersion: 1, settings: { theme: 'dark' } }).settings.theme).toBe('dark');
    expect(() => migrate('nope')).toThrow(MigrationError);
  });
});

describe('store', () => {
  it('records steps, completion and answers, and persists on flush', () => {
    store.setLessonStep('L1', 3);
    store.recordAnswer('i1', false);
    store.recordAnswer('i2', true);
    store.completeLesson('L1');
    store.flush();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.lessons.L1).toMatchObject({ completed: true, furthest: 5 });
    expect(saved.items.i1).toMatchObject({ firstTry: false, box: 1 });
    expect(saved.items.i2).toMatchObject({ firstTry: true, box: 2 });
    expect(saved.days).toContain(store.todayKey());
  });

  it('exports and imports the same shape, and rejects garbage', () => {
    store.setLessonStep('L1', 1);
    const json = store.exportJSON();
    store.reset();
    expect(store.getState().lessons).toEqual({});
    expect(store.importJSON(json)).toEqual({ ok: true });
    expect(store.getState().lessons.L1.step).toBe(1);
    expect(store.importJSON('{not json').ok).toBe(false);
  });

  it('reset keeps settings', () => {
    store.setSettings({ uiLang: 'en' });
    store.setLessonStep('L1', 1);
    store.reset();
    expect(store.getState().settings.uiLang).toBe('en');
    expect(store.getState().lessons).toEqual({});
  });

  it('keeps working in memory when storage throws', () => {
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    try {
      store.__resetForTests();
      expect(store.isStorageAvailable()).toBe(false);
      store.setLessonStep('L1', 2);
      store.flush();
      expect(store.getState().lessons.L1.step).toBe(2);
    } finally {
      spy.mockRestore();
    }
  });
});

describe('derived state', () => {
  const rung = { id: 'easy-1', name: 'Easy 1', name_zh: { zh: '初级 一', py: 'chūjí yī' }, status: 'live', lessons: 8, tier: 'easy', hsk: '1', pinyin: 'always', tone_colours_default: true, words_cum: 500, chars_cum: 300, description: { id: '', en: '' }, topics: ['x'], threads: [], inventory: [], optional: false } as Rung;
  const mk = (n: number): LessonSummary => ({
    id: `L${n}`,
    slug: `0${n}-x`,
    rung: 'easy-1',
    order: n,
    status: 'draft',
    minutes: 6,
    title: { en: `L${n}`, id: `L${n}`, zh: '好', py: 'hǎo' },
    keyword: null,
    checkIds: [`L${n}-c1`],
    resume: ['s0', 's1', 's2', 's3', 's4', 's5'].map((s) => ({ text: `${s}-${n}` })),
    checkTexts: [{ text: `check-${n}` }],
    glossary: [],
    wordIds: [],
  });
  const lessons = [mk(1), mk(2)];

  it('starts at the placed rung after the placement check', () => {
    store.applyPlacement({ score: 19, total: 20, result: 'easy-1', missed: [] });
    expect(continueTarget([rung], lessons, store.getState())).toMatchObject({ kind: 'lesson', step: 0, lesson: { id: 'L1' } });
  });

  it('welcomes a first visit', () => {
    expect(continueTarget([rung], lessons, emptyState()).kind).toBe('welcome');
  });

  it('continues the open lesson at its step, quoting the check item', () => {
    const p = emptyState();
    p.lessons.L1 = { step: 4, furthest: 4, checkIndex: 0, completed: false, lastOpened: 5 };
    expect(continueTarget([rung], lessons, p)).toMatchObject({ kind: 'lesson', step: 4, text: { text: 'check-1' } });
  });

  it('moves to the next lesson after finishing one', () => {
    const p = emptyState();
    p.lessons.L1 = { step: 5, furthest: 5, completed: true, lastOpened: 5 };
    expect(continueTarget([rung], lessons, p)).toMatchObject({ kind: 'lesson', lesson: { id: 'L2' }, step: 0 });
  });

  describe('with an optional Starter rung', () => {
    const starter = { ...rung, id: 'starter', name: 'Starter', optional: true } as Rung;
    const st = (n: number): LessonSummary => ({ ...mk(n), id: `S${n}`, rung: 'starter' });
    const all = [st(1), st(2), ...lessons];
    it('is never the current rung by itself', () => {
      expect(currentRung([starter, rung], emptyState()).id).toBe('easy-1');
    });
    it('keeps a learner in Starter after finishing a Starter lesson', () => {
      const p = emptyState();
      p.lessons.S1 = { step: 5, furthest: 5, completed: true, lastOpened: 5 };
      expect(continueTarget([starter, rung], all, p)).toMatchObject({ kind: 'lesson', lesson: { id: 'S2' } });
    });
    it('moves on to Easy 1 once Starter is finished', () => {
      const p = emptyState();
      p.lessons.S1 = { step: 5, furthest: 5, completed: true, lastOpened: 5 };
      p.lessons.S2 = { step: 5, furthest: 5, completed: true, lastOpened: 6 };
      expect(continueTarget([starter, rung], all, p)).toMatchObject({ kind: 'lesson', lesson: { id: 'L1' } });
    });
  });

  it('marks lessons with first-try misses as to review', () => {
    const p = emptyState();
    p.lessons.L1 = { step: 5, furthest: 5, completed: true, lastOpened: 5 };
    p.items['L1-c1'] = { firstTry: false, box: 1, lastSeen: 1 };
    expect(lessonState(lessons[0], p)).toEqual({ kind: 'review', n: 1 });
  });

  it('builds a Monday-first week', () => {
    const p = emptyState();
    p.days = ['2026-10-12'];
    const w = weekDays(p, new Date('2026-10-15T10:00:00'));
    expect(w[0]).toMatchObject({ key: '2026-10-12', practised: true });
    expect(w[3].today).toBe(true);
  });
});

describe('placement and capstones', () => {
  it('marks Huruf rungs climbed via placement and never un-climbs', () => {
    store.recordTest('dasar-1', { score: 14, total: 14, seed: 1, date: 'x' }, true);
    store.applyPlacement({ score: 19, total: 20, result: 'easy-1', missed: [] });
    let s = store.getState();
    expect(s.rungs['dasar-1']).toMatchObject({ climbed: true, via: 'test' });
    expect(s.rungs['dasar-2']).toMatchObject({ climbed: true, via: 'placement' });
    expect(s.placement).toMatchObject({ score: 19, result: 'easy-1' });
    // A lower retake never un-climbs.
    store.applyPlacement({ score: 5, total: 20, result: 'dasar-1', missed: [] });
    s = store.getState();
    expect(s.rungs['dasar-2'].climbed).toBe(true);
    expect(s.placement?.result).toBe('dasar-1');
  });

  it('places 14–17 at Huruf 2 with Huruf 1 climbed', () => {
    store.applyPlacement({ score: 15, total: 20, result: 'dasar-2', missed: ['dasar2-07-components'] });
    const s = store.getState();
    expect(s.rungs['dasar-1']).toMatchObject({ climbed: true, via: 'placement' });
    expect(s.rungs['dasar-2']).toBeUndefined();
    expect(s.placement?.missed).toEqual(['dasar2-07-components']);
  });

  it('saves capstone completion once, and it persists', () => {
    store.completeCapstone('easy-1', 'dialogue');
    const first = store.getState().capstones['easy-1'].dialogue;
    expect(first).toBeTruthy();
    store.completeCapstone('easy-1', 'dialogue');
    expect(store.getState().capstones['easy-1'].dialogue).toBe(first);
    store.flush();
    store.__resetForTests();
    expect(store.getState().capstones['easy-1'].dialogue).toBe(first);
  });

  it('keeps capstones and placement through migration, dropping bad placement', () => {
    const s = migrate({ schemaVersion: 1, capstones: { 'dasar-2': { reading: 'd' } }, placement: { score: 'x' } });
    expect(s.capstones['dasar-2'].reading).toBe('d');
    expect(s.placement).toBeNull();
  });
});

describe('word deck and traces in progress', () => {
  it('adds a lesson\'s words to the deck when it is completed, and reviews them', () => {
    store.__resetForTests();
    store.completeLesson('L9', ['w-1-aaaa', 'w-1-bbbb']);
    const s = store.getState();
    expect(s.deck['w-1-aaaa']).toMatchObject({ box: 1, learned: true, lastSeen: 0 });
    store.reviewCard('w-1-aaaa', true);
    expect(store.getState().deck['w-1-aaaa'].box).toBe(2);
    store.reviewCard('w-1-aaaa', false);
    expect(store.getState().deck['w-1-aaaa'].box).toBe(1);
  });
  it('keeps the best trace per character', () => {
    store.__resetForTests();
    store.recordTrace('你', 3);
    store.recordTrace('你', 1);
    store.recordTrace('你', 2);
    expect(store.getState().traces['你'].bestMisses).toBe(1);
  });
  it('drops malformed deck entries on load', () => {
    const s = migrate({ schemaVersion: 1, deck: { a: { box: 9, due: 1 }, b: { box: 2, due: 5, learned: true, lastSeen: 3 } } });
    expect(Object.keys(s.deck)).toEqual(['b']);
    expect(s.deck.b.first).toBe(5);
  });
});
