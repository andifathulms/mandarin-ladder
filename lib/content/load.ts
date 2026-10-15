// Build-time only. Never import this file from a client component.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import {
  CurriculumSchema,
  DialogueSchema,
  LessonFrontmatterSchema,
  LettersSchema,
  LexiconSchema,
  MakhrajSchema,
  PlacementSchema,
  ReadingSchema,
  TestPoolSchema,
} from './schema';
import { parseSections } from './sections';
import { itemText } from '../check/text';
import { parseInline, stripMarkup } from '../markup';
import type {
  Dialogue,
  Lesson,
  LessonSummary,
  Letter,
  LexiconEntry,
  MakhrajPoint,
  Placement,
  Quote,
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

export function lessonFiles(rungId: string): string[] {
  const dir = path.join(CONTENT_DIR, rungId);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}-[a-z0-9-]+\.md$/.test(f))
    .sort();
}

export function parseLessonFile(rungId: string, file: string): Lesson {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, rungId, file), 'utf8');
  const { data, content } = matter(raw, {
    engines: { yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object },
  });
  const fm = LessonFrontmatterSchema.parse(data);
  const sections = parseSections(content, `${rungId}/${file}`);
  return { ...fm, ...sections, slug: file.replace(/\.md$/, '') };
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

const quoteOf = (e: { ar: string; tr: string } | undefined, fallback: string): Quote =>
  e ? { text: stripMarkup(e.ar), tr: stripMarkup(e.tr) } : { text: fallback };

export function summarize(l: Lesson): LessonSummary {
  const readable = l.examples.filter((e) => !e.display_only);
  const first = readable[0] ?? l.examples[0];
  const focus = parseInline(first.ar).find((t) => t.t === 'focus')?.v ?? null;
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

export function getTestPool(rungId: string): TestPool | null {
  if (!exists(`${rungId}/test.yaml`)) return null;
  return TestPoolSchema.parse(readYaml(`${rungId}/test.yaml`));
}

export function getReading(rungId: string): Reading | null {
  if (!exists(`${rungId}/reading.yaml`)) return null;
  return ReadingSchema.parse(readYaml(`${rungId}/reading.yaml`));
}

export function getDialogue(rungId: string): Dialogue | null {
  if (!exists(`${rungId}/dialogue.yaml`)) return null;
  return DialogueSchema.parse(readYaml(`${rungId}/dialogue.yaml`));
}

export function getPlacement(): Placement | null {
  if (!exists('placement.yaml')) return null;
  return PlacementSchema.parse(readYaml('placement.yaml'));
}

export function getLetters(): Letter[] {
  if (!exists('data/letters.yaml')) return [];
  return LettersSchema.parse(readYaml('data/letters.yaml'));
}

export function getMakhraj(): MakhrajPoint[] {
  if (!exists('data/makhraj.yaml')) return [];
  return MakhrajSchema.parse(readYaml('data/makhraj.yaml'));
}

/** core.yaml plus any per-rung lexicon files beside it (lexicon/<rung>.yaml). */
export function getLexicon(): LexiconEntry[] {
  const dir = path.join(CONTENT_DIR, 'lexicon');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort((a, b) => (a === 'core.yaml' ? -1 : b === 'core.yaml' ? 1 : a.localeCompare(b)));
  return files.flatMap((f) => LexiconSchema.parse(readYaml(`lexicon/${f}`) ?? []));
}
