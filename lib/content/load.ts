// Build-time only. Never import this file from a client component.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import {
  CurriculumSchema,
  DasarPointsSchema,
  DeckSchema,
  DialogueSchema,
  HokkienSchema,
  LessonFrontmatterSchema,
  MeasureWordsSchema,
  NamesSchema,
  PlacementSchema,
  RadicalsSchema,
  StrokeNamesSchema,
  ReadingSchema,
  TestPoolSchema,
} from './schema';
import { parseSections } from './sections';
import type { StrokeName } from '../zh/trace';
import { fillItemPinyin, type Names } from './autopy';
import { itemText } from '../check/text';
import { parseInline } from '../markup';
import { plainZh } from '../zh/text';
import type {
  CheckItem,
  DasarPoint,
  Deck,
  Dialogue,
  GlossaryEntry,
  HokkienEntry,
  Lesson,
  LessonSummary,
  MeasureWord,
  Placement,
  Quote,
  Radical,
  Reading,
  Rung,
  TestPool,
} from '../types';

export const CONTENT_DIR = path.join(process.cwd(), 'content');

const readYaml = (file: string): unknown =>
  yaml.load(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'), { schema: yaml.JSON_SCHEMA });
const exists = (file: string) => fs.existsSync(path.join(CONTENT_DIR, file));

/** Production builds show reviewed lessons only, unless drafts are explicitly enabled. */
export function showDrafts(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_DRAFTS === 'true';
}

let curriculumCache: Rung[] | null = null;
export function getCurriculum(): Rung[] {
  if (!curriculumCache) curriculumCache = CurriculumSchema.parse(readYaml('curriculum.yaml')).rungs;
  return curriculumCache;
}

export function getRung(id: string): Rung | undefined {
  return getCurriculum().find((r) => r.id === id);
}

// ---------- data files ----------

const once = <T>(fn: () => T) => {
  let v: T | undefined;
  return () => (v ??= fn());
};

export const getNames = once((): (Names[number] & { id: string })[] => (exists('data/names.yaml') ? NamesSchema.parse(readYaml('data/names.yaml')) : []));
export const getDasarPoints = once((): DasarPoint[] => (exists('data/dasar-points.yaml') ? DasarPointsSchema.parse(readYaml('data/dasar-points.yaml')) : []));
export const getHokkien = once((): HokkienEntry[] => (exists('data/hokkien.yaml') ? HokkienSchema.parse(readYaml('data/hokkien.yaml')) : []));
export const getRadicals = once((): Radical[] => (exists('data/radicals.yaml') ? RadicalsSchema.parse(readYaml('data/radicals.yaml')) : []));
/** Authored stroke names per character (content/data/stroke-names.yaml), checked against the stroke counts. */
export const getStrokeNames = once((): Record<string, StrokeName[]> => (exists('data/stroke-names.yaml') ? StrokeNamesSchema.parse(readYaml('data/stroke-names.yaml')) : {}));
export const getMeasureWords = once((): MeasureWord[] => (exists('data/measure-words.yaml') ? MeasureWordsSchema.parse(readYaml('data/measure-words.yaml')) : []));

export function getDeck(rungId: string): Deck | null {
  if (!exists(`${rungId}/deck.yaml`)) return null;
  return DeckSchema.parse(readYaml(`${rungId}/deck.yaml`));
}

// ---------- lessons ----------

export function lessonFiles(rungId: string): string[] {
  const dir = path.join(CONTENT_DIR, rungId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}-[a-z0-9-]+\.md$/.test(f))
    .sort();
}

/** Pinyin for unresolved item strings, per file, for content-check to report. */
export const missingPinyin = new Map<string, string[]>();

function withPinyin(items: CheckItem[], glossary: GlossaryEntry[], where: string): CheckItem[] {
  return items.map((c) => {
    const { item, missing } = fillItemPinyin(c, glossary, getNames());
    if (missing.length) missingPinyin.set(`${where}: ${c.id}`, missing);
    return item;
  });
}

export function parseLessonFile(rungId: string, file: string): Lesson {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, rungId, file), 'utf8');
  const { data, content } = matter(raw, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
  const fm = LessonFrontmatterSchema.parse(data);
  const sections = parseSections(content, `${rungId}/${file}`);
  const glossary = [...fm.glossary, ...rungGlossary(rungId, fm.order)];
  return { ...fm, check: withPinyin(fm.check, glossary, `${rungId}/${file}`), ...sections, slug: file.replace(/\.md$/, '') };
}

/** Glossary entries of a rung's lessons before `order` (and earlier rungs), for item pinyin. */
function rungGlossary(rungId: string, order = Infinity): GlossaryEntry[] {
  const rungs = getCurriculum();
  const upTo = rungs.findIndex((r) => r.id === rungId);
  const out: GlossaryEntry[] = [];
  for (const r of rungs.slice(0, upTo + 1)) {
    for (const f of lessonFiles(r.id)) {
      const n = Number(f.slice(0, 2));
      if (r.id === rungId && n >= order) continue;
      const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, r.id, f), 'utf8'), {
        engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
      });
      const g = (data as { glossary?: GlossaryEntry[] }).glossary;
      if (Array.isArray(g)) out.push(...g.filter((x) => x && typeof x.zh === 'string' && typeof x.py === 'string'));
    }
  }
  return out;
}

const lessonCache = new Map<string, Lesson[]>();
export function getLessons(rungId: string, opts: { includeDrafts?: boolean } = {}): Lesson[] {
  if (!lessonCache.has(rungId)) {
    lessonCache.set(
      rungId,
      lessonFiles(rungId)
        .map((f) => parseLessonFile(rungId, f))
        .sort((a, b) => a.order - b.order),
    );
  }
  const all = lessonCache.get(rungId)!;
  const drafts = opts.includeDrafts ?? showDrafts();
  return all.filter((l) => drafts || l.status === 'reviewed');
}

export function getLesson(rungId: string, slug: string): Lesson | undefined {
  return getLessons(rungId).find((l) => l.slug === slug);
}

const quoteOf = (e: { zh: string; py: string } | undefined, fallback: string): Quote =>
  e ? { text: plainZh(e.zh), zh: e.zh, py: e.py } : { text: fallback };

export function summarize(l: Lesson): LessonSummary {
  const first = l.examples[0];
  const focus = parseInline(first.zh).find((t) => t.t === 'focus')?.v.replace(/\s+/g, '') ?? l.hanzi?.[0] ?? null;
  return {
    id: l.id,
    slug: l.slug,
    rung: l.rung,
    order: l.order,
    status: l.status,
    minutes: l.minutes,
    title: l.title,
    keyword: focus,
    checkIds: l.check.map((c) => c.id),
    resume: [
      quoteOf(first, l.title.id),
      quoteOf(l.worked?.[0] ?? first, l.title.id),
      quoteOf(first, l.title.id),
      quoteOf(l.pair.natural, l.title.id),
      { text: itemText(l.check[0]) },
      { text: l.summary.id },
    ],
    checkTexts: l.check.map((c) => ({ text: itemText(c) })),
    glossary: l.glossary,
  };
}

/** Every lesson summary across all rungs (respecting draft visibility). */
export function getAllSummaries(): LessonSummary[] {
  return getCurriculum().flatMap((r) => getLessons(r.id).map(summarize));
}

// ---------- tests, capstones, placement ----------

export function getTestPool(rungId: string): TestPool | null {
  if (!exists(`${rungId}/test.yaml`)) return null;
  const p = TestPoolSchema.parse(readYaml(`${rungId}/test.yaml`));
  return { ...p, items: withPinyin(p.items, rungGlossary(rungId), `${rungId}/test.yaml`) };
}

export function getReading(rungId: string): Reading | null {
  if (!exists(`${rungId}/reading.yaml`)) return null;
  const r = ReadingSchema.parse(readYaml(`${rungId}/reading.yaml`));
  return { ...r, items: withPinyin(r.items, [...r.glossary, ...rungGlossary(rungId)], `${rungId}/reading.yaml`) };
}

export function getDialogue(rungId: string): Dialogue | null {
  if (!exists(`${rungId}/dialogue.yaml`)) return null;
  const d = DialogueSchema.parse(readYaml(`${rungId}/dialogue.yaml`));
  return { ...d, items: withPinyin(d.items, rungGlossary(rungId), `${rungId}/dialogue.yaml`) };
}

export function getPlacement(): Placement | null {
  if (!exists('placement.yaml')) return null;
  const p = PlacementSchema.parse(readYaml('placement.yaml'));
  return { ...p, items: withPinyin(p.items, rungGlossary('easy-1'), 'placement.yaml') };
}
