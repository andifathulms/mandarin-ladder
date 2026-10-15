import { z } from 'zod';
import { VISUAL_IDS } from '../visualIds';

const Bilingual = z.object({ id: z.string().min(1), en: z.string().min(1) }).strict();

const Visual = z
  .object({ id: z.enum(VISUAL_IDS), props: z.record(z.unknown()).default({}) })
  .strict();

/** A Chinese line: authored words with spaces, pinyin token for token (CLAUDE.md §5.2). */
const ZhPy = { zh: z.string().min(1), py: z.string().min(1) };
const ZhLine = z
  .object({ ...ZhPy, id: z.string().min(1), en: z.string().min(1).optional(), note: Bilingual.optional() })
  .strict();

const itemBase = {
  id: z.string().regex(/^[a-z0-9-]+$/, 'ids are lowercase, digits and dashes'),
  cue: z.string().optional(),
  why: Bilingual,
  from: z.string().optional(),
  /** Show pinyin over Chinese in this item. Default: follow the rung, except reading items (false). */
  show_pinyin: z.boolean().optional(),
  /**
   * Pinyin for Chinese strings in the item, keyed by the Chinese string as written. Filled at build
   * time from the lesson glossary and the dictionaries; authors add entries only to override.
   */
  py: z.record(z.string()).optional(),
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
/** Word tiles; the answer line joins them without spaces. */
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
  .object({ ...itemBase, type: z.literal('listen'), prompt: z.string().optional(), audio: z.string().min(1), options: Options, answer: z.string() })
  .strict();

/** A tone sequence, e.g. [3, 3]; 0 is the neutral tone. */
const Tones = z.array(z.number().int().min(0).max(4)).min(1).max(4);

/**
 * Hear a syllable or word, pick its tones. audio is Chinese text (with audio_py) or a syllable key
 * (syl-ma3). With ask: spoken, the answer is the sandhi of the written tones, checked at build.
 */
export const ToneItem = z
  .object({
    ...itemBase,
    type: z.literal('tone'),
    prompt: z.string().optional(),
    audio: z.string().min(1),
    audio_py: z.string().optional(),
    ask: z.enum(['written', 'spoken']).default('written'),
    options: z.array(Tones).min(2).max(4),
    answer: Tones,
  })
  .strict();

/** Hear a syllable or word, type its pinyin (numbers or marks). */
export const PinyinItem = z
  .object({
    ...itemBase,
    type: z.literal('pinyin'),
    prompt: z.string().optional(),
    audio: z.string().min(1),
    answer: z.string().min(1),
    accept: z.array(z.string().min(1)).optional(),
  })
  .strict();

/** Draw a character stroke by stroke over the practice grid. */
export const TraceItem = z
  .object({
    ...itemBase,
    type: z.literal('trace'),
    prompt: z.string().optional(),
    char: z.string().length(1),
    guide: z.enum(['on', 'off']).default('on'),
  })
  .strict();

/** Pick the components that make a character (好 = 女 + 子). */
export const BuildItem = z
  .object({
    ...itemBase,
    type: z.literal('build'),
    prompt: z.string().optional(),
    char: z.string().length(1),
    parts: z.array(z.string().min(1)).min(3).max(6),
    answer: z.array(z.string().min(1)).min(2).max(3),
  })
  .strict();

const sameSeq = (a: number[], b: number[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export const CheckItemSchema = z
  .discriminatedUnion('type', [ChoiceItem, GapItem, OrderItem, SceneItem, FixItem, ListenItem, ToneItem, PinyinItem, TraceItem, BuildItem])
  .superRefine((item, ctx) => {
    if (item.type === 'tone') {
      if (!item.options.some((o) => sameSeq(o, item.answer))) ctx.addIssue({ code: 'custom', path: ['answer'], ...optionsMsg });
      if (!/^syl-/.test(item.audio) && !item.audio_py) {
        ctx.addIssue({ code: 'custom', path: ['audio_py'], message: 'a tone item with Chinese audio needs audio_py' });
      }
      return;
    }
    if (item.type === 'build') {
      for (const a of item.answer) if (!item.parts.includes(a)) ctx.addIssue({ code: 'custom', path: ['answer'], message: `answer part ${a} is not among the parts` });
      return;
    }
    if ('options' in item && !(item.options as string[]).includes(item.answer as string)) {
      ctx.addIssue({ code: 'custom', path: ['answer'], ...optionsMsg });
    }
    if (item.type === 'gap' && item.prompt.split('___').length !== 2) {
      ctx.addIssue({ code: 'custom', path: ['prompt'], message: 'gap prompt needs exactly one ___' });
    }
    if (item.type === 'order') {
      const sorted = (a: string[]) => [...a].sort().join('\u0000');
      for (const a of [item.answer, ...(item.accept ?? [])]) {
        if (sorted(a) !== sorted(item.tiles)) ctx.addIssue({ code: 'custom', path: ['answer'], message: 'answer must use exactly the tiles' });
      }
    }
  });

/** Nada card: a word or phrase with its tone contour, written and spoken. */
const ToneCard = z.object({ ...ZhPy, note: Bilingual }).strict();

/** Ngobrol: a short exchange. */
const TalkLine = z.object({ who: z.string().min(1), ...ZhPy, id: z.string().min(1), en: z.string().min(1).optional(), note: Bilingual.optional() }).strict();
const Talk = z.object({ lines: z.array(TalkLine).min(2).max(4) }).strict();

export const GlossaryEntry = z
  .object({
    ...ZhPy,
    id: z.string().min(1),
    en: z.string().min(1).optional(),
    /** Measure word for a noun (本 for 书). */
    mw: z.string().min(1).optional(),
    /** HSK level of the word; omitted for names and extra words. */
    hsk: z.string().regex(/^([1-6]|7-9)$/).optional(),
  })
  .strict();

/** A word outside the HSK lists, with the reason it is in the lesson (CLAUDE.md §6.1). */
const Extra = z.object({ zh: z.string().min(1), reason: z.string().min(1) }).strict();

const Review = z.object({ by: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).strict();

const Title = z.object({ id: z.string().min(1), en: z.string().min(1), zh: z.string().min(1), py: z.string().min(1) }).strict();

export const LessonFrontmatterSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    rung: z.string(),
    order: z.number().int().min(1).max(20),
    status: z.enum(['draft', 'reviewed']),
    review: Review.optional(),
    minutes: z.number().int().min(3).max(15),
    title: Title,
    summary: Bilingual,
    introduces: z.array(z.string()).min(1),
    spiral: z.string(),
    visual: Visual.optional(),
    /** Worked examples for the See step when there is no visual. */
    worked: z.array(ZhLine).min(2).max(8).optional(),
    examples: z.array(ZhLine).min(4).max(6),
    pair: z.object({ off: z.object(ZhPy).strict(), natural: z.object(ZhPy).strict() }).strict(),
    tone: ToneCard.optional(),
    /** New characters of the lesson (Hanzi card). */
    hanzi: z.array(z.string().length(1)).max(12).optional(),
    /** Kata card: traps and bridges between Indonesian and Chinese. */
    words: Bilingual.optional(),
    /** Hokkien loanword bridges for the Kata card, by Indonesian word in content/data/hokkien.yaml. */
    hokkien: z.array(z.string().min(1)).max(3).optional(),
    talk: Talk.optional(),
    /** Repeat-after sentence closing the Examples step. */
    tirukan: z.object({ ...ZhPy, id: z.string().min(1), en: z.string().min(1).optional() }).strict(),
    check: z.array(CheckItemSchema).min(4).max(6),
    glossary: z.array(GlossaryEntry).min(1).max(16),
    extra: z.array(Extra).optional(),
    next: z.string().nullable().optional(),
  })
  .strict()
  .refine((l) => l.visual || l.worked, { message: 'a lesson needs either a visual or a worked example for the See step' })
  .refine((l) => l.status !== 'reviewed' || !!l.review, { message: 'a reviewed lesson needs review.by and review.date' });

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
    /** Grammar point ids (content/data/hsk/grammar.yaml) or Dasar point ids (content/data/dasar-points.yaml). */
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

/** Baca dan dengar: one short text per rung, using only that rung's inventory, with a few questions. */
export const ReadingSchema = z
  .object({
    rung: z.string(),
    title: Title,
    lines: z.array(ZhLine).min(2).max(12),
    glossary: z.array(GlossaryEntry).max(8).default([]),
    items: z.array(CheckItemSchema).min(2).max(4),
  })
  .strict();

/** Ngobrol capstone: a 6–10 line dialogue with audio, pinyin and translation. */
export const DialogueSchema = z
  .object({
    rung: z.string(),
    title: Title,
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

/** Word-deck extras per rung: Indonesian meanings and example sentences for the HSK words. */
export const DeckSchema = z
  .object({
    rung: z.string(),
    /** Indonesian meaning per HSK word, keyed "zh py" (e.g. "爱 ài"), with optional measure word. */
    words: z.record(z.object({ id: z.string().min(1), mw: z.string().optional() }).strict()),
    examples: z.array(z.object({ word: z.string().min(1), ...ZhPy, id: z.string().min(1) }).strict()).default([]),
  })
  .strict();

/** Proper names allowed in content without an HSK entry. */
export const NamesSchema = z.array(z.object({ ...ZhPy, id: z.string().min(1) }).strict());

/** Ids for the Dasar rungs' inventory (pinyin, tones, strokes, radicals). */
export const DasarPointsSchema = z.array(z.object({ id: z.string().regex(/^d[12]-[a-z0-9-]+$/), rung: z.string(), title: Bilingual }).strict());

/** Hokkien loanword bridges (CLAUDE.md §6.7). */
export const HokkienSchema = z.array(
  z
    .object({
      id_word: z.string().min(1),
      hokkien: z.string().min(1),
      ...ZhPy,
      meaning: Bilingual,
      /** Who confirmed the Hokkien form; entries without it render only in draft builds. */
      reviewed_by: z.string().min(1).optional(),
    })
    .strict(),
);

/** Measure words (MeasureWords visual, Kata card). */
export const MeasureWordsSchema = z.array(
  z
    .object({
      mw: z.string().length(1),
      py: z.string().min(1),
      id_classifier: z.string().optional(),
      note: Bilingual,
      examples: z.array(z.object({ ...ZhPy, id: z.string().min(1) }).strict()).min(1),
    })
    .strict(),
);

/** Radicals and components with their meanings (Hanzi card, CharacterParts, build items). */
export const RadicalsSchema = z
  .array(z.object({ part: z.string().min(1), forms: z.array(z.string().min(1)).optional(), py: z.string().min(1), id: z.string().min(1), en: z.string().min(1) }).strict())
  .superRefine((list, ctx) => {
    const seen = new Set<string>();
    list.forEach((r, i) => {
      for (const f of [r.part, ...(r.forms ?? [])]) {
        if (seen.has(f)) ctx.addIssue({ code: 'custom', path: [i, 'part'], message: `${f} is listed twice` });
        seen.add(f);
      }
    });
  });

/** Authored stroke names per character (DESIGN §8.5). */
export const StrokeNamesSchema = z.record(z.string().length(1), z.array(z.enum(['heng', 'shu', 'pie', 'dian', 'na', 'ti', 'zhe', 'gou'])).min(1));

export const SECTION_HEADINGS = ['concept.id', 'concept.en', 'contrast.id', 'contrast.en'] as const;

