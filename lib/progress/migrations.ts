import { SCHEMA_VERSION } from './constants';
import { DEFAULT_SETTINGS, emptyState } from './defaults';
import type { PlacementRecord, ProgressState } from './types';

type Raw = Record<string, unknown> & { schemaVersion?: unknown };

/**
 * Upgrades stored state one version at a time. Add a step here whenever the shape changes;
 * never edit an existing step after release.
 */
const steps: Record<number, (s: Raw) => Raw> = {
  // 0 → 1: pre-release shape had no schemaVersion. Nothing to move.
  0: (s) => ({ ...s, schemaVersion: 1 }),
};

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export class MigrationError extends Error {}

function validPlacement(v: unknown): PlacementRecord | null {
  if (!isObj(v)) return null;
  const ok =
    typeof v.score === 'number' &&
    typeof v.total === 'number' &&
    typeof v.date === 'string' &&
    (v.result === 'easy-1' || v.result === 'dasar-2' || v.result === 'dasar-1');
  if (!ok) return null;
  return { ...(v as PlacementRecord), missed: Array.isArray(v.missed) ? v.missed.filter((x): x is string => typeof x === 'string') : [] };
}

export function migrate(input: unknown): ProgressState {
  if (!isObj(input)) throw new MigrationError('not an object');
  let s: Raw = { ...input };
  let v = typeof s.schemaVersion === 'number' ? s.schemaVersion : 0;
  if (v > SCHEMA_VERSION) throw new MigrationError(`schemaVersion ${v} is newer than this app`);
  while (v < SCHEMA_VERSION) {
    const step = steps[v];
    if (!step) throw new MigrationError(`no migration from version ${v}`);
    s = step(s);
    v = s.schemaVersion as number;
  }
  return normalize(s);
}

/** Fills missing fields with defaults and drops anything with the wrong type. */
function normalize(s: Raw): ProgressState {
  const base = emptyState();
  const settings = isObj(s.settings) ? s.settings : {};
  const pick = <K extends keyof typeof DEFAULT_SETTINGS>(k: K, allowed: readonly unknown[]) =>
    (allowed.includes(settings[k]) ? settings[k] : DEFAULT_SETTINGS[k]) as (typeof DEFAULT_SETTINGS)[K];
  return {
    ...base,
    lessons: isObj(s.lessons) ? (s.lessons as ProgressState['lessons']) : {},
    items: isObj(s.items) ? (s.items as ProgressState['items']) : {},
    rungs: isObj(s.rungs) ? (s.rungs as ProgressState['rungs']) : {},
    capstones: isObj(s.capstones) ? (s.capstones as ProgressState['capstones']) : {},
    placement: validPlacement(s.placement),
    days: Array.isArray(s.days) ? s.days.filter((d): d is string => typeof d === 'string').slice(-60) : [],
    opened: Array.isArray(s.opened) ? s.opened.filter((d): d is string => typeof d === 'string') : [],
    settings: {
      uiLang: pick('uiLang', ['id', 'en']),
      voice: pick('voice', ['female', 'male']),
      rate: pick('rate', [0.75, 1]),
      sfx: pick('sfx', [true, false]),
      textSize: pick('textSize', [100, 115, 130]),
      arabicSize: pick('arabicSize', [100, 120, 140]),
      theme: pick('theme', ['system', 'light', 'dark']),
      motion: pick('motion', ['system', 'reduce']),
    },
  };
}
