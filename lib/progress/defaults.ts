import { SCHEMA_VERSION } from './constants';
import type { ProgressState, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  uiLang: 'id',
  voice: 'female',
  rate: 1,
  sfx: true,
  textSize: 100,
  arabicSize: 100,
  theme: 'light',
  motion: 'system',
};

export function emptyState(): ProgressState {
  return {
    schemaVersion: SCHEMA_VERSION,
    lessons: {},
    items: {},
    rungs: {},
    capstones: {},
    placement: null,
    days: [],
    opened: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}
