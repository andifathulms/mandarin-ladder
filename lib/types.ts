import type { z } from 'zod';
import type {
  CheckItemSchema,
  DialogueSchema,
  GlossaryEntry as GlossaryEntrySchema,
  LessonFrontmatterSchema,
  LetterSchema,
  LexiconEntry as LexiconEntrySchema,
  MakhrajSchema,
  PlacementSchema,
  ReadingSchema,
  RungSchema,
} from './content/schema';

// Type-only imports: erased at compile, so client code can use these without pulling in zod.
export type Bilingual = { id: string; en: string };
export type CheckItem = z.infer<typeof CheckItemSchema>;
export type Rung = z.infer<typeof RungSchema>;
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
export type Letter = z.infer<typeof LetterSchema>;
export type MakhrajPoint = z.infer<typeof MakhrajSchema>[number];
export type LexiconEntry = z.infer<typeof LexiconEntrySchema>;

export type LessonSections = { concept: Bilingual; contrast: Bilingual };

/** Plain JSON handed to client components. */
export type Lesson = LessonFrontmatter & LessonSections & { slug: string };

/** A line to quote on the continue card: Arabic (with transliteration) or Latin. */
export type Quote = { text: string; tr?: string };

/** Lightweight lesson info for lists, the ladder and the continue card. */
export type LessonSummary = {
  id: string;
  slug: string;
  rung: string;
  order: number;
  status: 'draft' | 'reviewed';
  minutes: number;
  title: { id: string; en: string; ar: string };
  /** The lesson's Arabic keyword, for the chip on the rung page (the first example's focus). */
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
