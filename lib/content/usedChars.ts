// Build-time only: the hanzi the site can show, for font subsets (CLAUDE.md §7.6) and stroke files (§5.6).
import fs from 'node:fs';
import path from 'node:path';
import { getCurriculum } from './load';
import { getChars, getWords, HSK_LEVELS, levelIndex, rungLevel } from './hsk';

const ROOT = process.cwd();
const HAN = /\p{Script=Han}/u;

function walk(dir: string, exts: RegExp, skip: string[] = []): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((d) => {
      const p = path.join(dir, d.name);
      if (d.isDirectory()) return skip.includes(d.name) ? [] : walk(p, exts, skip);
      return exts.test(d.name) ? [p] : [];
    });
}

/**
 * Every Han character the site may show, in order of first appearance along the curriculum:
 *  - content: lessons in curriculum order, then the rest of content/ (except the generated HSK data)
 *  - the UI: lib/i18n, components, app
 *  - every character and word of the live rungs' HSK levels (the deck shows them all)
 * `strokes` is the subset a learner can open stroke order for: content and live-rung words, not UI chrome.
 */
export function usedChars(): { ordered: string[]; strokes: Set<string> } {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const strokes = new Set<string>();
  const add = (text: string, forStrokes: boolean) => {
    for (const ch of text) {
      if (!HAN.test(ch)) continue;
      if (forStrokes) strokes.add(ch);
      if (seen.has(ch)) continue;
      seen.add(ch);
      ordered.push(ch);
    }
  };
  const rungs = getCurriculum();
  for (const r of rungs) for (const f of walk(path.join(ROOT, 'content', r.id), /\.(md|ya?ml)$/)) add(fs.readFileSync(f, 'utf8'), true);
  // Placement and the rest of content/: shown, but only lessons, tests and capstones need stroke order.
  // Data files (Hokkien forms, radicals, names) and the curriculum's topics are text, not characters to learn.
  for (const f of walk(path.join(ROOT, 'content'), /\.(md|ya?ml)$/, ['hsk'])) {
    add(fs.readFileSync(f, 'utf8'), !f.endsWith('curriculum.yaml') && !f.includes(`${path.sep}data${path.sep}`));
  }
  for (const dir of ['lib/i18n', 'components', 'app']) for (const f of walk(path.join(ROOT, dir), /\.(ts|tsx)$/)) add(fs.readFileSync(f, 'utf8'), false);
  const live = rungs.filter((r) => r.status === 'live');
  const max = Math.max(-1, ...live.map((r) => levelIndex(rungLevel(r))));
  const chars = getChars();
  for (const l of HSK_LEVELS.slice(0, max + 1)) add(chars[l], true);
  for (const w of getWords()) if (levelIndex(w.hsk) <= max) add(w.zh, true);
  return { ordered, strokes };
}
