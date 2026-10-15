/*
 * Lists what live rungs play that has no recording yet, as CSV for the voice actor:
 *   key,text,where
 * Chinese strings use key = sha1(normZh(text)) first 12; syllables use syl-<base><tone> (CLAUDE.md §7.7).
 * The actor returns one file per row named <key>.wav (or .mp3/.m4a/.flac) for `npm run audio:ingest`.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { CONTENT_DIR, getCurriculum, getDeck, getDialogue, getLessons, getPlacement, getReading, getTestPool } from '../lib/content/load';
import { getWords, levelIndex, rungLevel } from '../lib/content/hsk';
import { audioKey, isSyllableKey, syllableKey, type Manifest } from '../lib/speech/audio';
import { stripMarkup } from '../lib/markup';
import { plainZh, hasHan } from '../lib/zh/text';
import { syllables } from '../lib/zh/pinyin';
import type { CheckItem, Lesson } from '../lib/types';

export type AudioRow = { key: string; text: string; where: string };

/** What an item plays: listen, tone and pinyin audio. */
function itemAudio(c: CheckItem): string[] {
  if (c.type === 'listen' || c.type === 'tone' || c.type === 'pinyin') return [c.audio];
  return [];
}

/** Every Chinese string a lesson plays. */
function lessonAudio(l: Lesson): string[] {
  return [
    ...l.examples.map((e) => e.zh),
    ...(l.worked ?? []).map((e) => e.zh),
    l.pair.natural.zh,
    ...(l.tone ? [l.tone.zh] : []),
    ...(l.talk?.lines ?? []).map((t) => t.zh),
    l.tirukan.zh,
    ...l.glossary.map((g) => g.zh),
    ...l.check.flatMap(itemAudio),
  ];
}

/** Syllables written in a lesson's pinyin (tones 1–4), as syllable keys. */
function lessonSyllables(l: Lesson): string[] {
  const out: string[] = [];
  const add = (py: string) => {
    for (const w of py.replace(/\[\[|\]\]/g, '').split(/[\s,.!?;:]+/)) {
      for (const s of syllables(w) ?? []) if (s.tone && !s.erhua) out.push(syllableKey(s.base, s.tone));
    }
  };
  for (const e of [...l.examples, ...(l.worked ?? []), l.pair.natural, l.tirukan, ...l.glossary, ...(l.tone ? [l.tone] : [])]) add(e.py);
  return out;
}

/** Every string and syllable live rungs may play, deduplicated by key. */
export function allAudio(): { rows: AudioRow[]; syllables: Map<string, string> } {
  const rows = new Map<string, AudioRow>();
  const syl = new Map<string, string>();
  const add = (text: string, where: string) => {
    if (isSyllableKey(text)) {
      if (!syl.has(text)) syl.set(text, where);
      return;
    }
    if (!hasHan(text)) return;
    const key = audioKey(text);
    if (!rows.has(key)) rows.set(key, { key, text: plainZh(stripMarkup(text)), where });
  };
  const live = getCurriculum().filter((r) => r.status === 'live');
  for (const r of live) {
    for (const l of getLessons(r.id, { includeDrafts: true })) {
      for (const s of lessonAudio(l)) add(s, `${r.id}/${l.slug}`);
      // Dasar 1 plays syllables on their own (ToneContour, SyllableBuilder, the Nada card).
      if (r.id === 'dasar-1') for (const k of lessonSyllables(l)) add(k, `${r.id}/${l.slug}`);
      const raw = fs.readFileSync(path.join(CONTENT_DIR, r.id, `${l.slug}.md`), 'utf8');
      for (const m of raw.matchAll(/syl-[a-zü]+[1-4]/g)) add(m[0], `${r.id}/${l.slug}`);
    }
    for (const c of getTestPool(r.id)?.items ?? []) for (const s of itemAudio(c)) add(s, `${r.id}/test`);
    const reading = getReading(r.id);
    if (reading) {
      reading.lines.forEach((x) => add(x.zh, `${r.id}/reading`));
      reading.glossary.forEach((g) => add(g.zh, `${r.id}/reading`));
      reading.items.forEach((c) => itemAudio(c).forEach((s) => add(s, `${r.id}/reading`)));
    }
    const dialogue = getDialogue(r.id);
    if (dialogue) {
      dialogue.lines.forEach((x) => add(x.zh, `${r.id}/dialogue`));
      dialogue.items.forEach((c) => itemAudio(c).forEach((s) => add(s, `${r.id}/dialogue`)));
    }
    // The word deck plays every word of the rung's level, and its example sentences.
    if (r.hsk !== '—') {
      for (const w of getWords()) if (levelIndex(w.hsk) === levelIndex(rungLevel(r))) add(w.zh, `${r.id}/deck`);
      for (const e of getDeck(r.id)?.examples ?? []) add(e.zh, `${r.id}/deck`);
    }
  }
  for (const c of getPlacement()?.items ?? []) for (const s of itemAudio(c)) add(s, 'placement');
  return { rows: [...rows.values()], syllables: syl };
}

export function readManifest(): Manifest {
  const file = path.join(process.cwd(), 'public', 'audio', 'manifest.json');
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest) : {};
}

/**
 * Strings without a recording, whether content/audio/fallback.yaml accepts browser speech for them,
 * and syllables without a recording (never accepted: syllables don't fall back to speech).
 */
export function missingAudio(): { missing: AudioRow[]; accepted: boolean; syllables: string[] } {
  const manifest = readManifest();
  const { rows, syllables: syl } = allAudio();
  const missing = rows.filter((r) => !manifest[r.key]);
  const file = path.join(CONTENT_DIR, 'audio', 'fallback.yaml');
  let accepted = false;
  if (fs.existsSync(file)) {
    const doc = (yaml.load(fs.readFileSync(file, 'utf8')) ?? {}) as { accept_all?: boolean; keys?: string[] };
    const keys = new Set(doc.keys ?? []);
    accepted = doc.accept_all === true || missing.every((m) => keys.has(m.key));
  }
  return { missing, accepted, syllables: [...syl.keys()].filter((k) => !manifest[k]).sort() };
}

const csv = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const { missing, syllables: syl } = missingAudio();
  console.log('key,text,where');
  for (const k of syl) console.log([k, k.slice(4), 'syllable'].map(csv).join(','));
  for (const r of missing) console.log([r.key, r.text, r.where].map(csv).join(','));
  console.error(`audio:list — ${syl.length} syllables and ${missing.length} strings without a recording`);
}
