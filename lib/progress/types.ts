export type Settings = {
  uiLang: 'id' | 'en';
  voice: 'female' | 'male';
  rate: 0.75 | 1;
  sfx: boolean;
  textSize: 100 | 115 | 130;
  /** Ukuran hanzi: multiplies only Chinese type. */
  zhSize: 100 | 120 | 140;
  /** Tone colours: follow each rung's default ('rung'), or always on or off. */
  toneColours: boolean | 'rung';
  /** New word-deck cards a day. */
  deckDaily: 5 | 10 | 20;
  /** What the deck card shows first. */
  deckFace: 'hanzi' | 'meaning' | 'audio';
  theme: 'system' | 'light' | 'dark';
  motion: 'system' | 'reduce';
};

export type LessonProgress = {
  /** Step the learner is on (0–5). */
  step: number;
  /** Furthest step reached. */
  furthest: number;
  /** Check item the learner is on, when step is the Check step. */
  checkIndex?: number;
  completed: boolean;
  lastOpened: number;
};

export type ItemProgress = {
  /** Result of the first answer in the most recent attempt. */
  firstTry: boolean;
  /** Leitner box 1–3. */
  box: 1 | 2 | 3;
  lastSeen: number;
};

export type TestAttempt = { score: number; total: number; seed: number; date: string };

export type RungProgress = {
  tests: TestAttempt[];
  climbed: boolean;
  /** How the rung was climbed: by passing its test, or marked by the placement check. */
  via?: 'test' | 'placement';
};

/** Done dates (ISO) per capstone, per rung. */
export type CapstoneProgress = { reading?: string; dialogue?: string };
export type CapstoneKind = keyof CapstoneProgress;

export type PlacementResult = 'easy-1' | 'dasar-2' | 'dasar-1';
export type PlacementRecord = {
  score: number;
  total: number;
  date: string;
  result: PlacementResult;
  /** Lesson ids behind the missed items, highlighted on the placed rung's page. */
  missed: string[];
};

export type ProgressState = {
  schemaVersion: number;
  lessons: Record<string, LessonProgress>;
  items: Record<string, ItemProgress>;
  rungs: Record<string, RungProgress>;
  capstones: Record<string, CapstoneProgress>;
  placement: PlacementRecord | null;
  /** Local dates (YYYY-MM-DD) with practice, newest last, at most 60. */
  days: string[];
  /** Lessons whose glossary has been seen (for My words). */
  opened: string[];
  settings: Settings;
};
