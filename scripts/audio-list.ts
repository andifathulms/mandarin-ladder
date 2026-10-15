/*
 * Lists Arabic strings in live rungs that have no recording yet, as CSV for the voice actor:
 *   key,variety,text,where
 * The actor returns one file per row named <key>.wav (or .mp3/.m4a/.flac) for `npm run audio:ingest`.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import {
  CONTENT_DIR,
  getCurriculum,
  getDialogue,
  getLessons,
  getLetters,
  getPlacement,
  getReading,
  getTestPool,
} from '../lib/content/load';
import { audioStrings } from '../lib/content/arabicTexts';
import { audioKey, type Manifest } from '../lib/speech/audio';
import { stripMarkup } from '../lib/markup';
import { hasArabic } from '../lib/arabic/text';
import type { CheckItem } from '../lib/types';

export type AudioRow = { key: string; variety: 'fusha' | 'eg'; text: string; where: string };

const VOWELS = ['َ', 'ِ', 'ُ'];

function itemAudio(c: CheckItem): { text: string; variety: 'fusha' | 'eg' }[] {
  if (c.type === 'listen') return [{ text: stripMarkup(c.audio), variety: c.variety }];
  if (c.type === 'spell' && c.audio) return [{ text: stripMarkup(c.audio), variety: 'fusha' }];
  if (c.type === 'mark') return [{ text: stripMarkup(c.ar), variety: 'fusha' }];
  return [];
}

/** Every string the app may play in live rungs, deduplicated by key. */
export function allAudio(): AudioRow[] {
  const rows = new Map<string, AudioRow>();
  const add = (text: string, variety: 'fusha' | 'eg', where: string) => {
    if (!hasArabic(text)) return;
    const key = audioKey(text, variety);
    if (!rows.has(key)) rows.set(key, { key, variety, text: stripMarkup(text).trim(), where });
  };
  const live = getCurriculum().filter((r) => r.status === 'live');
  // Letters and letter + short-vowel syllables for the Huruf rungs.
  if (live.some((r) => r.tier === 'huruf')) {
    for (const l of getLetters()) {
      add(l.letter, 'fusha', `letters/${l.name_id}`);
      if (l.letter !== 'ا' && l.letter !== 'ى' && l.letter !== 'ة') for (const v of VOWELS) add(l.letter + v, 'fusha', `letters/${l.name_id}`);
    }
  }
  for (const r of live) {
    for (const l of getLessons(r.id, { includeDrafts: true })) {
      for (const s of audioStrings(l)) add(s.text, s.variety, `${r.id}/${l.slug}`);
    }
    for (const c of getTestPool(r.id)?.items ?? []) for (const s of itemAudio(c)) add(s.text, s.variety, `${r.id}/test`);
    const reading = getReading(r.id);
    if (reading) {
      add(reading.ar, 'fusha', `${r.id}/reading`);
      reading.glossary.forEach((g) => add(g.ar, 'fusha', `${r.id}/reading`));
      reading.items.forEach((c) => itemAudio(c).forEach((s) => add(s.text, s.variety, `${r.id}/reading`)));
    }
    const dialogue = getDialogue(r.id);
    if (dialogue) {
      dialogue.lines.forEach((ln) => add(ln.ar, dialogue.variety, `${r.id}/dialogue`));
      dialogue.items.forEach((c) => itemAudio(c).forEach((s) => add(s.text, s.variety, `${r.id}/dialogue`)));
    }
  }
  for (const c of getPlacement()?.items ?? []) for (const s of itemAudio(c)) add(s.text, s.variety, 'placement');
  return [...rows.values()];
}

export function readManifest(): Manifest {
  const file = path.join(process.cwd(), 'public', 'audio', 'manifest.json');
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Manifest) : {};
}

/** Strings without a recording, and whether content/audio/fallback.yaml accepts them for now. */
export function missingAudio(): { missing: AudioRow[]; accepted: boolean } {
  const manifest = readManifest();
  const missing = allAudio().filter((r) => !manifest[r.key]);
  const file = path.join(CONTENT_DIR, 'audio', 'fallback.yaml');
  let accepted = false;
  if (fs.existsSync(file)) {
    const doc = (yaml.load(fs.readFileSync(file, 'utf8')) ?? {}) as { accept_all?: boolean; keys?: string[] };
    const keys = new Set(doc.keys ?? []);
    accepted = doc.accept_all === true || missing.every((m) => keys.has(m.key));
  }
  return { missing, accepted };
}

const csv = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const { missing } = missingAudio();
  console.log('key,variety,text,where');
  for (const r of missing) console.log([r.key, r.variety, r.text, r.where].map(csv).join(','));
  console.error(`audio:list — ${missing.length} strings without a recording`);
}
