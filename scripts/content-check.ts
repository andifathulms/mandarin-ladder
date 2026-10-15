/* Validates all content. Exits non-zero on any error. Run by `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';
import { ZodError } from 'zod';
import {
  CONTENT_DIR,
  getCurriculum,
  getDialogue,
  getLetters,
  getLexicon,
  getMakhraj,
  getPlacement,
  getReading,
  getTestPool,
  lessonFiles,
  parseLessonFile,
} from '../lib/content/load';
import { focusCount } from '../lib/markup';
import type { CheckItem, Lesson } from '../lib/types';
import { lintLessons } from '../lib/content/lint';
import { lintPhysical } from './lint-physical';
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

function sentencesOf(item: CheckItem): string[] {
  switch (item.type) {
    case 'choice':
    case 'gap':
      return [item.prompt, ...item.options];
    case 'order':
      return [item.answer.join(' ')];
    case 'scene':
      return item.options;
    case 'fix':
      return [item.wrong, ...item.options];
    case 'listen':
      return [item.audio, ...item.options];
    case 'read':
      return [item.ar, ...item.options];
    case 'spell':
      return [item.answer];
    case 'mark':
      return [item.ar];
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

// 2. Lessons
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
      for (const inv of l.introduces) {
        if (!rung.inventory.includes(inv)) err(`${where}: introduces "${inv}" not in rung inventory`);
      }
      if (rung.tier !== 'huruf' && l.glossary.length < 6) err(`${where}: needs 6–12 glossary entries`);
      for (const c of l.check) {
        claim(c.id, where);
        for (const s of sentencesOf(c)) if (focusCount(s) > 1) err(`${where}: ${c.id}: more than one [[focus]] in "${s}"`);
      }
      const lines = [...l.examples.map((e) => e.ar), ...(l.talk?.lines ?? []).map((t) => t.ar), l.pair.natural.ar, l.pair.off.ar];
      for (const s of lines) if (focusCount(s) > 1) err(`${where}: more than one [[focus]] in "${s}"`);
      if (/[ﭐ-﷿ﹰ-﻿]/.test(fs.readFileSync(path.join(CONTENT_DIR, rung.id, file), 'utf8'))) {
        err(`${where}: presentation-form code points (U+FB50–U+FEFF); store base letters`);
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

// 3. Test pools
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

// 3b. Capstones: reading and dialogue
for (const rung of rungs) {
  for (const [file, get] of [
    ['reading.yaml', getReading],
    ['dialogue.yaml', getDialogue],
  ] as const) {
    if (!fs.existsSync(path.join(CONTENT_DIR, rung.id, file))) continue;
    try {
      const doc = get(rung.id)!;
      if (doc.rung !== rung.id) err(`${rung.id}/${file}: rung "${doc.rung}" does not match folder`);
      for (const item of doc.items) claim(item.id, `${rung.id}/${file}`);
    } catch (e) {
      err(fmtZod(`${rung.id}/${file}`, e));
    }
  }
}

// 3c. Placement
if (fs.existsSync(path.join(CONTENT_DIR, 'placement.yaml'))) {
  try {
    const p = getPlacement()!;
    for (const item of p.items) {
      claim(item.id, 'placement.yaml');
      if (item.match !== 'exact') err(`placement.yaml: ${item.id}: placement items need match: exact`);
      if (item.from && !allLessonIds.has(item.from)) err(`placement.yaml: ${item.id}: from "${item.from}" is not a lesson`);
    }
    const count = (s: string) => p.items.filter((i) => i.section === s).length;
    const want = { forms: 6, reading: 6, harakat: 4, sounds: 4 };
    for (const [s, n] of Object.entries(want)) if (count(s) !== n) err(`placement.yaml: ${count(s)} ${s} items, want ${n}`);
    if (!(p.thresholds.easy1 > p.thresholds.huruf2)) err('placement.yaml: thresholds.easy1 must be above thresholds.huruf2');
  } catch (e) {
    err(fmtZod('placement.yaml', e));
  }
}

// 4. Data
try {
  const letters = getLetters();
  const seen = new Set<string>();
  for (const l of letters) {
    if (seen.has(l.letter)) err(`data/letters.yaml: duplicate letter ${l.letter}`);
    seen.add(l.letter);
    if (/[ﭐ-﷿ﹰ-﻿]/.test(Object.values(l.forms).join(''))) err(`data/letters.yaml: ${l.letter}: presentation forms`);
  }
  const makhraj = new Set(getMakhraj().map((m) => m.id));
  for (const l of letters) if (makhraj.size && !makhraj.has(l.makhraj)) err(`data/letters.yaml: ${l.letter}: unknown makhraj "${l.makhraj}"`);
} catch (e) {
  err(fmtZod('data/letters.yaml or data/makhraj.yaml', e));
}
try {
  const lex = getLexicon();
  for (const e of lex) if (!rungIds.has(e.rung)) err(`lexicon/core.yaml: ${e.ar}: unknown rung "${e.rung}"`);
} catch (e) {
  err(fmtZod('lexicon/core.yaml', e));
}

// 5. Arabic lint: inventory, script, lexicon, harakat, reviewers
for (const f of lintLessons(rungs, lessonsByRung)) (f.level === 'error' ? errors : warnings).push(f.message);

// 6. No physical CSS in Arabic-bearing components (CLAUDE.md §6.3)
for (const f of lintPhysical()) err(`${f.file}:${f.line}: physical CSS "${f.match}" (use a logical property)`);

// 7. Audio: every Arabic string in a live rung has a recording, or is accepted with fallback.
const audio = missingAudio();
if (audio.missing.length) {
  const msg = `${audio.missing.length} Arabic strings in live rungs have no recording (npm run audio:list)`;
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
