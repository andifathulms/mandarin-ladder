import type { z } from 'zod';
import type {
  CheckItemSchema,
  DasarPointsSchema,
  DeckSchema,
  DialogueSchema,
  GlossaryEntry as GlossaryEntrySchema,
  HokkienSchema,
  LessonFrontmatterSchema,
  MeasureWordsSchema,
  PlacementSchema,
  RadicalsSchema,
  ReadingSchema,
  RungSchema,
} from './content/schema';

// Type-only imports: erased at compile, so client code can use these without pulling in zod.
export type Bilingual = { id: string; en: string };
export type CheckItem = z.infer<typeof CheckItemSchema>;
export type Rung = z.infer<typeof RungSchema>;
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
export type HokkienEntry = z.infer<typeof HokkienSchema>[number];
export type MeasureWord = z.infer<typeof MeasureWordsSchema>[number];
export type DasarPoint = z.infer<typeof DasarPointsSchema>[number];
export type Deck = z.infer<typeof DeckSchema>;
export type Radical = z.infer<typeof RadicalsSchema>[number];

export type LessonSections = { concept: Bilingual; contrast: Bilingual };

/** Plain JSON handed to client components. */
export type Lesson = LessonFrontmatter & LessonSections & { slug: string };

/** A line to quote on the continue card: Chinese with its pinyin, or Latin text. */
export type Quote = { text: string; zh?: string; py?: string };

/** Lightweight lesson info for lists, the ladder and the continue card. */
export type LessonSummary = {
  id: string;
  slug: string;
  rung: string;
  order: number;
  status: 'draft' | 'reviewed';
  minutes: number;
  title: { id: string; en: string; zh: string; py: string };
  /** The lesson's key character or word, for the chip on the rung page (the first example's focus). */
  keyword: string | null;
  checkIds: string[];
  /** Step resume text: index 0..5 → a line to quote on the continue card. */
  resume: Quote[];
  /** One line per check item, for resuming mid-check. */
  checkTexts: Quote[];
  glossary: GlossaryEntry[];
};

export type Reading = z.infer<typeof ReadingSchema>;
export type Dialogue = z.infer<typeof DialogueSchema>;
export type Placement = z.infer<typeof PlacementSchema>;

export type TestPool = { rung: string; draw: number; pass: number; items: CheckItem[] };

/** What the tap-a-word sheet shows for a word (DESIGN §6.4). */
export type WordInfo = {
  zh: string;
  py: string;
  id: string;
  en?: string;
  /** Measure word for a noun (一本书 → 本). */
  mw?: string;
  hsk?: string;
  trad?: string;
};

/** One part of a character in the Hanzi card and CharacterParts (DESIGN §8.6). */
export type HanziPart = {
  part: string;
  /** meaning: the semantic component (the radical, usually); sound: the phonetic component. */
  role: 'meaning' | 'sound' | 'part';
  /** Its meaning in Indonesian and English, when known; its reading for a sound part. */
  label?: Bilingual;
  py?: string;
};

/** What the Hanzi card shows for a new character. */
export type HanziCard = {
  ch: string;
  py: string;
  strokes: number;
  radical: string;
  /** Layout of the decomposition: ⿰ left-right, ⿱ top-bottom, ⿴ enclosure… (Make Me a Hanzi). */
  layout: string | null;
  parts: HanziPart[];
  /** A one-line memory note: 妈 = 女 (perempuan) + 马 (bunyi mǎ). */
  note: Bilingual | null;
};
