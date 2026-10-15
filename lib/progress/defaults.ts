import { SCHEMA_VERSION } from './constants';
import type { ProgressState, Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  uiLang: 'id',
  voice: 'female',
  rate: 1,
  sfx: true,
  textSize: 100,
  zhSize: 100,
  toneColours: 'rung',
  deckDaily: 10,
  deckFace: 'hanzi',
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
