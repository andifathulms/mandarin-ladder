/* Validates all content (CLAUDE.md §5–§6). Exits non-zero on any error. Run by `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';
import { ZodError } from 'zod';
import {
  CONTENT_DIR,
  getCurriculum,
  getDasarPoints,
  getDeck,
  getDialogue,
  getHokkien,
  getMeasureWords,
  getNames,
  getPlacement,
  getRadicals,
  getStrokeNames,
  getReading,
  getTestPool,
  lessonFiles,
  missingPinyin,
  parseLessonFile,
} from '../lib/content/load';
import { focusCount } from '../lib/markup';
import type { CheckItem, Lesson } from '../lib/types';
import { lintLessons } from '../lib/content/lint';
import { getHanzi } from '../lib/content/hsk';
import { usedChars } from '../lib/content/usedChars';
import { missingAudio } from './audio-list';

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

function fmtZod(file: string, e: unknown): string {
  if (e instanceof ZodError) {
    return e.issues.map((i) => `${file}: ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
  }
  return `${file}: ${(e as Error).message}`;
}

/** Strings that may carry one [[focus]]. */
function sentencesOf(item: CheckItem): string[] {
  switch (item.type) {
    case 'choice':
    case 'gap':
      return [item.prompt, ...item.options];
    case 'order':
      return [item.answer.join(' ')];
    case 'scene':
    case 'listen':
      return item.options;
    case 'fix':
      return [item.wrong, ...item.options];
    default:
      return [];
  }
}

const itemIds = new Map<string, string>();
const claim = (id: string, where: string) => {
  if (itemIds.has(id)) err(`${where}: ${id} already used in ${itemIds.get(id)}`);
  itemIds.set(id, where);
};

// 1. Curriculum
let rungs: ReturnType<typeof getCurriculum> = [];
try {
  rungs = getCurriculum();
} catch (e) {
  err(fmtZod('curriculum.yaml', e));
}
const rungIds = new Set(rungs.map((r) => r.id));
if (rungIds.size !== rungs.length) err('curriculum.yaml: duplicate rung ids');

// 2. Data files
for (const [file, get] of [
  ['data/names.yaml', getNames],
  ['data/dasar-points.yaml', getDasarPoints],
  ['data/hokkien.yaml', getHokkien],
  ['data/measure-words.yaml', getMeasureWords],
  ['data/radicals.yaml', getRadicals],
  ['data/stroke-names.yaml', getStrokeNames],
] as const) {
  try {
    get();
  } catch (e) {
    err(fmtZod(file, e));
  }
}

// 3. Lessons
const lessonsByRung = new Map<string, Lesson[]>();
const allLessonIds = new Set<string>();

for (const rung of rungs) {
  const lessons: Lesson[] = [];
  for (const file of lessonFiles(rung.id)) {
    const where = `${rung.id}/${file}`;
    try {
      const l = parseLessonFile(rung.id, file);
      if (l.rung !== rung.id) err(`${where}: rung "${l.rung}" does not match folder`);
      if (Number(file.slice(0, 2)) !== l.order) err(`${where}: order ${l.order} does not match file name`);
      if (allLessonIds.has(l.id)) err(`${where}: duplicate lesson id ${l.id}`);
      allLessonIds.add(l.id);
      for (const c of l.check) {
        claim(c.id, where);
        for (const s of sentencesOf(c)) if (focusCount(s) > 1) err(`${where}: ${c.id}: more than one [[focus]] in "${s}"`);
      }
      for (const s of [...l.examples.map((e) => e.zh), ...(l.talk?.lines ?? []).map((t) => t.zh), l.pair.natural.zh, l.pair.off.zh]) {
        if (focusCount(s) > 1) err(`${where}: more than one [[focus]] in "${s}"`);
      }
      lessons.push(l);
    } catch (e) {
      err(fmtZod(where, e));
    }
  }
  lessons.sort((a, b) => a.order - b.order);
  lessonsByRung.set(rung.id, lessons);
  if (rung.status === 'live') {
    if (lessons.length === 0) err(`${rung.id}: live rung has no lessons`);
    // Notch counts come from data (fixes English Ladder issue 7).
    if (lessons.length !== rung.lessons) err(`${rung.id}: curriculum says ${rung.lessons} lessons, found ${lessons.length}`);
  }
}

for (const lessons of lessonsByRung.values()) {
  for (const l of lessons) {
    if (l.next && !allLessonIds.has(l.next)) err(`${l.rung}/${l.slug}: next "${l.next}" is not a lesson`);
  }
}

// 4. Test pools
for (const rung of rungs) {
  if (!fs.existsSync(path.join(CONTENT_DIR, rung.id, 'test.yaml'))) {
    if (rung.status === 'live') err(`${rung.id}: live rung has no test.yaml`);
    continue;
  }
  try {
    const pool = getTestPool(rung.id)!;
    if (pool.rung !== rung.id) err(`${rung.id}/test.yaml: rung "${pool.rung}" does not match folder`);
    const lessons = lessonsByRung.get(rung.id) ?? [];
    const ids = new Set(lessons.map((l) => l.id));
    for (const item of pool.items) {
      if (!item.from || !ids.has(item.from)) err(`${rung.id}/test.yaml: ${item.id}: from "${item.from}" is not a lesson`);
      claim(item.id, `${rung.id}/test.yaml`);
    }
    for (const l of lessons) {
      if (!pool.items.some((i) => i.from === l.id)) err(`${rung.id}/test.yaml: no item from ${l.id}`);
    }
  } catch (e) {
    err(fmtZod(`${rung.id}/test.yaml`, e));
  }
}

// 5. Capstones and decks
for (const rung of rungs) {
  for (const [file, get] of [
    ['reading.yaml', getReading],
    ['dialogue.yaml', getDialogue],
    ['deck.yaml', getDeck],
  ] as const) {
    if (!fs.existsSync(path.join(CONTENT_DIR, rung.id, file))) continue;
    try {
      const doc = get(rung.id)!;
      if (doc.rung !== rung.id) err(`${rung.id}/${file}: rung "${doc.rung}" does not match folder`);
      if ('items' in doc) for (const item of doc.items) claim(item.id, `${rung.id}/${file}`);
    } catch (e) {
      err(fmtZod(`${rung.id}/${file}`, e));
    }
  }
}

// 6. Placement (PRD §5.2): 20 items in six sections, 17+ and 12+.
if (fs.existsSync(path.join(CONTENT_DIR, 'placement.yaml'))) {
  try {
    const p = getPlacement()!;
    for (const item of p.items) {
      claim(item.id, 'placement.yaml');
      if (item.from && !allLessonIds.has(item.from)) err(`placement.yaml: ${item.id}: from "${item.from}" is not a lesson`);
    }
    const count = (s: string) => p.items.filter((i) => i.section === s).length;
    const want = { tones: 6, pinyin: 4, sandhi: 2, strokes: 2, radicals: 3, chars: 3 };
    for (const [s, n] of Object.entries(want)) if (count(s) !== n) err(`placement.yaml: ${count(s)} ${s} items, want ${n}`);
    if (!(p.thresholds.easy1 > p.thresholds.dasar2)) err('placement.yaml: thresholds.easy1 must be above thresholds.dasar2');
  } catch (e) {
    err(fmtZod('placement.yaml', e));
  }
}

// 7. Item pinyin that could not be filled in (an item's py map can supply it).
for (const [where, missing] of missingPinyin) err(`${where}: no pinyin for ${missing.map((m) => `"${m}"`).join(', ')} (add it to the item's py map)`);

// 8. Mandarin lint: HSK lists, grammar inventory, characters, pinyin, reviewers, sizes.
for (const f of lintLessons(rungs, lessonsByRung)) (f.level === 'error' ? errors : warnings).push(f.message);

// 9. Stroke data for every character a learner can open (CLAUDE.md §5.6, §7.5).
const strokesDir = path.join(process.cwd(), 'public', 'strokes');
const noStrokes = [...usedChars().strokes].filter((c) => !fs.existsSync(path.join(strokesDir, `${c.codePointAt(0)!.toString(16)}.json`)));
if (noStrokes.length) err(`public/strokes: ${noStrokes.length} characters have no stroke file (npm run strokes:extract): ${noStrokes.slice(0, 20).join('')}`);

// 9b. Authored stroke names have one name per stroke.
for (const [ch, names] of Object.entries(getStrokeNames())) {
  const h = getHanzi()[ch];
  if (!h) err(`data/stroke-names.yaml: ${ch} has no Make Me a Hanzi data`);
  else if (h.matches.length !== names.length) err(`data/stroke-names.yaml: ${ch} has ${h.matches.length} strokes, ${names.length} names`);
}

// 10. Audio: every syllable a live rung plays has a recording; sentences may fall back to speech.
const audio = missingAudio();
if (audio.syllables.length) err(`${audio.syllables.length} syllables used in live rungs have no recording: ${audio.syllables.slice(0, 12).join(' ')}`);
if (audio.missing.length) {
  const msg = `${audio.missing.length} Chinese strings in live rungs have no recording (npm run audio:list)`;
  if (audio.accepted) warn(`${msg}; accepted with browser-speech fallback by content/audio/fallback.yaml`);
  else err(msg);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
const lessonCount = [...lessonsByRung.values()].reduce((n, l) => n + l.length, 0);
console.log(
  `content:check — ${rungs.length} rungs, ${lessonCount} lessons, ${itemIds.size} check items: ` +
    `${errors.length} errors, ${warnings.length} warnings`,
);
process.exit(errors.length ? 1 : 0);
