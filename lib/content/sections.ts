import { SECTION_HEADINGS } from './schema';
import type { LessonSections } from '../types';

type Heading = (typeof SECTION_HEADINGS)[number];

/** Splits a lesson body into its fixed "## concept.id" style sections. Unknown headings throw. */
export function parseSections(body: string, file = 'lesson'): LessonSections {
  const found: Partial<Record<Heading, string>> = {};
  const parts = body.split(/^##\s+/m);
  if (parts[0].trim()) throw new Error(`${file}: text before the first section heading`);
  for (const part of parts.slice(1)) {
    const nl = part.indexOf('\n');
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const text = (nl === -1 ? '' : part.slice(nl + 1)).trim();
    if (!(SECTION_HEADINGS as readonly string[]).includes(heading)) {
      throw new Error(`${file}: unknown section heading "## ${heading}"`);
    }
    if (found[heading as Heading] !== undefined) {
      throw new Error(`${file}: duplicate section "## ${heading}"`);
    }
    if (!text) throw new Error(`${file}: section "## ${heading}" is empty`);
    found[heading as Heading] = text;
  }
  for (const h of SECTION_HEADINGS) {
    if (!found[h]) throw new Error(`${file}: missing section "## ${h}"`);
  }
  return {
    concept: { id: found['concept.id']!, en: found['concept.en']! },
    contrast: { id: found['contrast.id']!, en: found['contrast.en']! },
  };
}
