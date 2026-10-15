import { STORAGE_KEY } from './constants';
import { emptyState } from './defaults';
import { migrate } from './migrations';
import { nextBox } from '../check/leitner';
import { dayNumber, review, teach } from '../deck/schedule';
import type { CapstoneKind, PlacementRecord, PlacementResult, ProgressState, Settings, TestAttempt } from './types';

// Single owner of localStorage. Everything else calls this API.

type Listener = () => void;

let state: ProgressState = emptyState();
let loaded = false;
let storageOk = true;
let timer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;
const listeners = new Set<Listener>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = migrate(JSON.parse(raw));
    // Probe that writes work too (Safari private mode, blocked site data).
    const probe = `${STORAGE_KEY}:probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
  } catch {
    storageOk = false;
  }
  try {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
    window.addEventListener('pagehide', flush);
  } catch {
    /* non-browser */
  }
}

export function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  if (!storageOk || !dirty) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    dirty = false;
  } catch {
    storageOk = false;
    emit();
  }
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: ProgressState) {
  state = next;
  dirty = true;
  emit();
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 250);
}

export function subscribe(l: Listener) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getState(): ProgressState {
  load();
  return state;
}

const SERVER_STATE = emptyState();
export const getServerState = () => SERVER_STATE;

export function isStorageAvailable() {
  load();
  return storageOk;
}

export function todayKey(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function markPracticedToday() {
  const s = getState();
  const t = todayKey();
  if (s.days[s.days.length - 1] === t) return;
  commit({ ...s, days: [...s.days.filter((d) => d !== t), t].slice(-60) });
}

export function setLessonStep(lessonId: string, step: number, checkIndex?: number) {
  const s = getState();
  const prev = s.lessons[lessonId];
  const opened = s.opened.includes(lessonId) ? s.opened : [...s.opened, lessonId];
  commit({
    ...s,
    opened,
    lessons: {
      ...s.lessons,
      [lessonId]: {
        step,
        furthest: Math.max(prev?.furthest ?? 0, step),
        checkIndex,
        completed: prev?.completed ?? false,
        lastOpened: Date.now(),
      },
    },
  });
}

/** Completes a lesson; its HSK words join the word deck as learned (PRD §5.8). */
export function completeLesson(lessonId: string, wordIds: string[] = []) {
  const s = getState();
  const prev = s.lessons[lessonId];
  const today = dayNumber();
  const deck = { ...s.deck };
  for (const id of wordIds) deck[id] = teach(deck[id], today);
  commit({
    ...s,
    deck,
    lessons: {
      ...s.lessons,
      [lessonId]: { step: 5, furthest: 5, completed: true, lastOpened: prev?.lastOpened ?? Date.now() },
    },
  });
  markPracticedToday();
}

/** Restarting a finished lesson keeps "completed" but begins a new attempt at step 0. */
export function restartLesson(lessonId: string) {
  const s = getState();
  const prev = s.lessons[lessonId];
  if (!prev) return;
  commit({ ...s, lessons: { ...s.lessons, [lessonId]: { ...prev, step: 0, checkIndex: undefined, lastOpened: Date.now() } } });
}

export function recordAnswer(itemId: string, correctFirstTry: boolean) {
  const s = getState();
  const prev = s.items[itemId];
  commit({
    ...s,
    items: {
      ...s.items,
      [itemId]: { firstTry: correctFirstTry, box: nextBox(prev?.box, correctFirstTry), lastSeen: Date.now() },
    },
  });
  markPracticedToday();
}

export function recordTest(rungId: string, attempt: TestAttempt, passed: boolean) {
  const s = getState();
  const prev = s.rungs[rungId] ?? { tests: [], climbed: false };
  commit({
    ...s,
    rungs: {
      ...s.rungs,
      [rungId]: {
        tests: [...prev.tests, attempt].slice(-20),
        climbed: prev.climbed || passed,
        via: prev.climbed ? prev.via : passed ? 'test' : undefined,
      },
    },
  });
  markPracticedToday();
}

/** Rungs each placement result marks as climbed (PRD §5.2). */
export const PLACEMENT_CLIMBS: Record<PlacementResult, string[]> = {
  'easy-1': ['dasar-1', 'dasar-2'],
  'dasar-2': ['dasar-1'],
  'dasar-1': [],
};

/**
 * Saves a placement result and marks rungs climbed via placement. Never un-climbs a rung, and never
 * overwrites a rung climbed by its test.
 */
export function applyPlacement(record: Omit<PlacementRecord, 'date'> & { date?: string }) {
  const s = getState();
  const rungs = { ...s.rungs };
  for (const id of PLACEMENT_CLIMBS[record.result]) {
    const prev = rungs[id] ?? { tests: [], climbed: false };
    if (!prev.climbed) rungs[id] = { ...prev, climbed: true, via: 'placement' };
  }
  commit({ ...s, rungs, placement: { ...record, date: record.date ?? new Date().toISOString() } });
}

/** Marks a capstone (reading or dialogue) done. Answers are recorded through recordAnswer. */
export function completeCapstone(rungId: string, kind: CapstoneKind) {
  const s = getState();
  const prev = s.capstones[rungId] ?? {};
  if (prev[kind]) return;
  commit({ ...s, capstones: { ...s.capstones, [rungId]: { ...prev, [kind]: new Date().toISOString() } } });
  markPracticedToday();
}

/** A word-deck review: Ingat (remembered) or Belum ingat. */
export function reviewCard(wordId: string, remembered: boolean) {
  const s = getState();
  commit({ ...s, deck: { ...s.deck, [wordId]: review(s.deck[wordId], remembered, dayNumber()) } });
  markPracticedToday();
}

/** A finished tracing attempt: keeps the best (fewest misses) per character. */
export function recordTrace(char: string, misses: number) {
  const s = getState();
  const prev = s.traces[char];
  commit({ ...s, traces: { ...s.traces, [char]: { bestMisses: Math.min(prev?.bestMisses ?? Infinity, misses), lastSeen: Date.now() } } });
}

export function getSettings(): Settings {
  return getState().settings;
}

export function setSettings(patch: Partial<Settings>) {
  const s = getState();
  commit({ ...s, settings: { ...s.settings, ...patch } });
  flush();
}

export function exportJSON(): string {
  return JSON.stringify(getState(), null, 2);
}

export type Result = { ok: true } | { ok: false; error: string };

export function importJSON(json: string): Result {
  try {
    const next = migrate(JSON.parse(json));
    commit(next);
    flush();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function reset() {
  const settings = getState().settings;
  commit({ ...emptyState(), settings });
  flush();
}

/** Test helper: forget loaded state so the next read reloads from storage. */
export function __resetForTests() {
  state = emptyState();
  loaded = false;
  storageOk = true;
  listeners.clear();
  if (timer) clearTimeout(timer);
  timer = null;
  dirty = false;
}
