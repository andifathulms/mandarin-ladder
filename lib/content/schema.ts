import { z } from 'zod';
import { VISUAL_IDS } from '../visualIds';
import { MARK_NAMES, markOn } from '../arabic/marks';

const Bilingual = z.object({ id: z.string().min(1), en: z.string().min(1) }).strict();

const Visual = z
  .object({ id: z.enum(VISUAL_IDS), props: z.record(z.unknown()).default({}) })
  .strict();

const itemBase = {
  id: z.string().regex(/^[a-z0-9-]+$/, 'ids are lowercase, digits and dashes'),
  cue: z.string().optional(),
  why: Bilingual,
  from: z.string().optional(),
  /** exact keeps harakat and hamza seats; loose (default) ignores them. */
  match: z.enum(['exact', 'loose']).optional(),
  /** Placement items only: which part of the check the item belongs to. */
  section: z.enum(['tones', 'pinyin', 'sandhi', 'strokes', 'radicals', 'chars']).optional(),
};

const optionsMsg = { message: 'answer must be one of the options' };
const Options = z.array(z.string().min(1)).min(2).max(4);

export const ChoiceItem = z
  .object({ ...itemBase, type: z.literal('choice'), prompt: z.string(), options: Options, answer: z.string() })
  .strict();
export const GapItem = z
  .object({ ...itemBase, type: z.literal('gap'), prompt: z.string(), options: Options, answer: z.string() })
  .strict();
export const OrderItem = z
  .object({
    ...itemBase,
    type: z.literal('order'),
    prompt: z.string().optional(),
    tiles: z.array(z.string().min(1)).min(2),
    answer: z.array(z.string().min(1)).min(2),
    accept: z.array(z.array(z.string().min(1))).optional(),
  })
  .strict();
export const SceneItem = z
  .object({
    ...itemBase,
    type: z.literal('scene'),
    prompt: z.string().optional(),
    visual: Visual,
    options: Options,
    answer: z.string(),
  })
  .strict();
export const FixItem = z
  .object({ ...itemBase, type: z.literal('fix'), wrong: z.string(), options: Options, answer: z.string() })
  .strict();

/** Played from a recording or speech; the text is shown only when nothing can play it. */
export const ListenItem = z
  .object({
    ...itemBase,
    type: z.literal('listen'),
    prompt: z.string().optional(),
    audio: z.string().min(1),
    variety: z.enum(['fusha', 'eg']).default('fusha'),
    options: Options,
    answer: z.string(),
  })
  .strict();

/** An Arabic word or phrase is shown; pick its transliteration or meaning. Never shows transliteration. */
export const ReadItem = z
  .object({ ...itemBase, type: z.literal('read'), prompt: z.string().optional(), ar: z.string().min(1), options: Options, answer: z.string() })
  .strict();

/**
 * Tap isolated letter tiles in order; the answer line joins them as a real word.
 * `letters` are the answer letters in order; `distractors` are extra tiles. With `dictation`,
 * the word is played and not shown (imla').
 */
export const SpellItem = z
  .object({
    ...itemBase,
    type: z.literal('spell'),
    prompt: z.string().optional(),
    letters: z.array(z.string().min(1)).min(2).max(10),
    distractors: z.array(z.string().min(1)).max(4).default([]),
    answer: z.string().min(1),
    audio: z.string().optional(),
    dictation: z.boolean().optional(),
  })
  .strict();

/** A vowelled word with one letter's mark hidden; pick the mark. */
export const MarkItem = z
  .object({
    ...itemBase,
    type: z.literal('mark'),
    prompt: z.string().optional(),
    ar: z.string().min(1),
    /** Index of the base letter (0 = first letter, marks not counted). */
    target: z.number().int().min(0),
    options: z.array(z.enum(MARK_NAMES)).min(2).max(4),
    answer: z.enum(MARK_NAMES),
  })
  .strict();

export const CheckItemSchema = z
  .discriminatedUnion('type', [ChoiceItem, GapItem, OrderItem, SceneItem, FixItem, ListenItem, ReadItem, SpellItem, MarkItem])
  .superRefine((item, ctx) => {
    if ('options' in item && !(item.options as string[]).includes(item.answer as string)) {
      ctx.addIssue({ code: 'custom', path: ['answer'], ...optionsMsg });
    }
    if (item.type === 'gap' && item.prompt.split('___').length !== 2) {
      ctx.addIssue({ code: 'custom', path: ['prompt'], message: 'gap prompt needs exactly one ___' });
    }
    if (item.type === 'order') {
      const sorted = (a: string[]) => [...a].sort().join('\u0000');
      for (const a of [item.answer, ...(item.accept ?? [])]) {
        if (sorted(a) !== sorted(item.tiles)) {
          ctx.addIssue({ code: 'custom', path: ['answer'], message: 'answer must use exactly the tiles' });
        }
      }
    }
    if (item.type === 'spell' && item.letters.join('').normalize('NFC') !== item.answer.normalize('NFC')) {
      ctx.addIssue({ code: 'custom', path: ['answer'], message: 'spell answer must be exactly the joined letters, in order' });
    }
    if (item.type === 'spell' && item.dictation && !item.audio) {
      ctx.addIssue({ code: 'custom', path: ['audio'], message: 'dictation needs audio' });
    }
    if (item.type === 'mark') {
      const actual = markOn(item.ar, item.target);
      if (actual === null) ctx.addIssue({ code: 'custom', path: ['target'], message: 'target is not a letter of the word' });
      else if (actual !== item.answer) {
        ctx.addIssue({ code: 'custom', path: ['answer'], message: `the word carries ${actual} on that letter, not ${item.answer}` });
      }
    }
  });

/** An Arabic line: fully vowelled Fusha with its transliteration and translation. */
const ArLine = {
  ar: z.string().min(1),
  tr: z.string().min(1),
  id: z.string().min(1),
  en: z.string().min(1).optional(),
};

const Example = z
  .object({
    ...ArLine,
    /** Egyptian variant in Arabic script, and its transliteration. */
    eg: z.string().min(1).optional(),
    eg_tr: z.string().min(1).optional(),
    note: Bilingual.optional(),
    /** Huruf 1 lesson 1 only: a known loanword shown as a picture of a word, not read. */
    display_only: z.boolean().optional(),
  })
  .strict()
  .refine((e) => !e.eg === !e.eg_tr, { message: 'eg and eg_tr go together' });

const ArPair = z.object({ ar: z.string().min(1), tr: z.string().min(1) }).strict();

/** Bunyi: one pronunciation point with playable words and a tip. */
const Sound = z
  .object({
    focus: z.string().min(1),
    compare: z.string().min(1).optional(),
    words: z.array(ArPair).min(1).max(6),
    tip: Bilingual,
  })
  .strict();

/** Ngobrol: a short exchange, in Fusha or Egyptian. */
const TalkLine = z
  .object({ who: z.string().min(1), ...ArLine, note: Bilingual.optional() })
  .strict();
const Talk = z
  .object({ variety: z.enum(['fusha', 'eg']), lines: z.array(TalkLine).min(2).max(4) })
  .strict();

export const GlossaryEntry = z
  .object({
    ar: z.string().min(1),
    tr: z.string().min(1),
    id: z.string().min(1),
    en: z.string().min(1).optional(),
    gender: z.enum(['m', 'f']).optional(),
    pos: z.enum(['noun', 'adj', 'verb', 'particle', 'pron', 'chunk', 'num', 'name']).optional(),
    eg: z.string().min(1).optional(),
    eg_tr: z.string().min(1).optional(),
    root: z.string().regex(/^[ء-ي](-[ء-ي]){2,3}$/, 'roots look like ك-ت-ب').optional(),
    /** A plural listed as a word (broken plurals are not taught before Easy 3). */
    pl: z.boolean().optional(),
    display_only: z.boolean().optional(),
  })
  .strict()
  .refine((g) => !g.eg === !g.eg_tr, { message: 'eg and eg_tr go together' });

const Review = z
  .object({ by: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), eg_by: z.string().min(1).optional() })
  .strict();

export const LessonFrontmatterSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    rung: z.string(),
    order: z.number().int().min(1).max(12),
    status: z.enum(['draft', 'reviewed']),
    review: Review.optional(),
    minutes: z.number().int().min(3).max(15),
    title: z.object({ id: z.string().min(1), en: z.string().min(1), ar: z.string().min(1) }).strict(),
    summary: Bilingual,
    introduces: z.array(z.string()).min(1),
    spiral: z.string(),
    visual: Visual.optional(),
    worked: z.array(Example).min(2).max(8).optional(),
    examples: z.array(Example).min(4).max(6),
    pair: z.object({ off: ArPair, natural: ArPair }).strict(),
    sound: Sound.optional(),
    /** Mesir card note; the card itself is built from the examples that have eg. */
    eg_note: Bilingual.optional(),
    /** Kata card: loanword meaning shifts. */
    words: Bilingual.optional(),
    talk: Talk.optional(),
    /** Repeat-after sentence closing the Examples step. */
    tirukan: z.object({ ...ArLine }).strict(),
    check: z.array(CheckItemSchema).min(4).max(6),
    glossary: z.array(GlossaryEntry).min(3).max(12),
    next: z.string().nullable().optional(),
  })
  .strict()
  .refine((l) => l.visual || l.worked, {
    message: 'a lesson needs either a visual or a worked example for the See step',
  })
  .refine((l) => l.status !== 'reviewed' || !!l.review, { message: 'a reviewed lesson needs review.by and review.date' });

/** A Chinese label with its pinyin, e.g. { zh: "初级 一", py: "chūjí yī" }. */
const ZhLabel = z.object({ zh: z.string().min(1), py: z.string().min(1) }).strict();

export const RungSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    name_zh: ZhLabel,
    tier: z.enum(['dasar', 'easy', 'medium', 'hard']),
    /** HSK 3.0 level: "—" for the Dasar rungs, "1"–"6", or "7-9" for the Hard rungs. */
    hsk: z.string().regex(/^(—|[1-6]|7-9)$/, 'hsk is "—", "1"–"6" or "7-9"'),
    status: z.enum(['live', 'soon']),
    /** An optional rung (Dasar) never becomes the learner's current rung on its own. */
    optional: z.boolean().default(false),
    /** Notch count; must equal the number of lesson files once live. */
    lessons: z.number().int(),
    /** The pinyin fade (PRD §4.5). */
    pinyin: z.enum(['always', 'new', 'on-request', 'off']),
    tone_colours_default: z.boolean(),
    /** Cumulative HSK 3.0 targets; checked against the imported lists. */
    words_cum: z.number().int().min(0),
    chars_cum: z.number().int().min(0),
    description: Bilingual,
    topics: z.array(z.string()).min(1),
    threads: z.array(z.string()).default([]),
    inventory: z.array(z.string()).default([]),
  })
  .strict();

export const CurriculumSchema = z.object({ rungs: z.array(RungSchema).min(1) }).strict();

export const TestPoolSchema = z
  .object({
    rung: z.string(),
    draw: z.number().int().default(16),
    pass: z.number().int().default(12),
    items: z.array(CheckItemSchema).min(8),
  })
  .strict()
  .refine((p) => p.items.length >= p.draw, { message: 'the pool needs at least draw items' })
  .refine((p) => p.pass <= p.draw, { message: 'pass cannot exceed draw' });

/** Baca dan dengar: one short Fusha text per rung, using only that rung's inventory, with a few questions. */
export const ReadingSchema = z
  .object({
    rung: z.string(),
    title: z.object({ id: z.string().min(1), en: z.string().min(1), ar: z.string().min(1) }).strict(),
    ...ArLine,
    glossary: z.array(GlossaryEntry).max(8).default([]),
    items: z.array(CheckItemSchema).min(2).max(4),
  })
  .strict();

/** Ngobrol capstone: a 6–10 line Egyptian dialogue with audio, transliteration and translation. */
export const DialogueSchema = z
  .object({
    rung: z.string(),
    variety: z.enum(['fusha', 'eg']).default('eg'),
    title: z.object({ id: z.string().min(1), en: z.string().min(1), ar: z.string().min(1) }).strict(),
    lines: z.array(TalkLine).min(6).max(10),
    note: Bilingual.optional(),
    items: z.array(CheckItemSchema).min(3).max(4),
  })
  .strict();

export const PLACEMENT_SECTIONS = ['tones', 'pinyin', 'sandhi', 'strokes', 'radicals', 'chars'] as const;

export const PlacementSchema = z
  .object({
    items: z.array(CheckItemSchema).length(20),
    thresholds: z.object({ easy1: z.number().int(), dasar2: z.number().int() }).strict(),
  })
  .strict()
  .superRefine((p, ctx) => {
    p.items.forEach((item, i) => {
      if (!item.section) ctx.addIssue({ code: 'custom', path: ['items', i, 'section'], message: 'placement items need a section' });
    });
  });

export const LetterSchema = z
  .object({
    letter: z.string().min(1),
    name_id: z.string().min(1),
    name_ar: z.string().min(1),
    tr: z.string(),
    joins_left: z.boolean(),
    family: z.string(),
    /** Display forms with tatweel (بـ ـبـ ـب), never presentation-form code points. */
    forms: z.object({ isolated: z.string(), initial: z.string(), medial: z.string(), final: z.string() }).strict(),
    example_words: z.object({ initial: z.string(), medial: z.string(), final: z.string() }).strict(),
    makhraj: z.string(),
    sun: z.boolean(),
    /** The Huruf 1 lesson that introduces the letter. */
    lesson: z.number().int().min(1).max(12),
  })
  .strict();
export const LettersSchema = z.array(LetterSchema).min(28);

export const MakhrajSchema = z
  .array(
    z
      .object({
        id: z.string(),
        label_id: z.string(),
        label_en: z.string(),
        x: z.number(),
        y: z.number(),
      })
      .strict(),
  )
  .min(1);

export const LexiconEntry = z
  .object({
    ar: z.string().min(1),
    pos: z.enum(['noun', 'adj', 'verb', 'particle', 'pron', 'chunk', 'num', 'name']),
    gender: z.enum(['m', 'f']).optional(),
    rung: z.string(),
    root: z.string().optional(),
  })
  .strict();

export const LexiconSchema = z.array(LexiconEntry);

export const SECTION_HEADINGS = ['concept.id', 'concept.en', 'contrast.id', 'contrast.en'] as const;
