/*
 * Imports the syllable recordings from vendor/audio-cmn (hugolpz/audio-cmn, 64k/syllabs: Chen Wang's
 * recordings, CC BY-SA; see public/audio/SOURCE.md) into public/audio as syl-<base><tone>, normalised
 * like every recording, and writes their keys into content/data/syllables.yaml. Only syllables on the
 * table (lib/zh/syllables.ts) with tones 1–4 are taken; the set has no neutral-tone clips.
 * Rarely run: the processed clips are committed.
 */
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { AUDIO_OUT, hasFfmpeg, pool, processClip, readManifest, writeManifest } from './audio-lib';
import { VENDOR } from './data-fetch';
import { isValidSyllable, tableSpelling } from '../lib/zh/syllables';
import { syllableKey } from '../lib/speech/audio';

const SRC = path.join(VENDOR, 'audio-cmn');
const SYL = path.join(process.cwd(), 'content', 'data', 'syllables.yaml');

async function main() {
  if (!hasFfmpeg()) {
    console.error('audio:syllables needs ffmpeg and ffprobe on PATH (brew install ffmpeg).');
    process.exit(1);
  }
  if (!fs.existsSync(SRC)) {
    console.error('vendor/audio-cmn is missing: download 64k/syllabs/*.mp3 from hugolpz/audio-cmn (pinned in public/audio/SOURCE.md).');
    process.exit(1);
  }
  const manifest = readManifest();
  const todo: { src: string; base: string; tone: number }[] = [];
  for (const f of fs.readdirSync(SRC)) {
    const m = /^cmn-([a-z]+)([1-4])\.mp3$/.exec(f);
    if (!m) continue;
    const base = tableSpelling(m[1].replace(/v/g, 'ü'));
    if (!isValidSyllable(base)) continue;
    todo.push({ src: path.join(SRC, f), base, tone: Number(m[2]) });
  }
  // Drop syllable clips no longer produced.
  for (const k of Object.keys(manifest)) {
    if (k.startsWith('syl-') && !todo.some((t) => syllableKey(t.base, t.tone) === k)) {
      fs.rmSync(path.join(AUDIO_OUT, manifest[k].file), { force: true });
      delete manifest[k];
    }
  }
  let done = 0;
  await pool(todo, 8, async (t) => {
    const key = syllableKey(t.base, t.tone);
    const { file, dur } = await processClip(t.src, key.replace('ü', 'v'));
    const old = manifest[key]?.file;
    if (old && old !== file) fs.rmSync(path.join(AUDIO_OUT, old), { force: true });
    manifest[key] = { file, dur };
    if (++done % 200 === 0) console.log(`  ${done}/${todo.length}`);
  });
  writeManifest(manifest);

  // Record the keys on the syllable table.
  const rows = yaml.load(fs.readFileSync(SYL, 'utf8')) as { py_base: string; audio?: Record<string, string> }[];
  for (const r of rows) {
    const audio: Record<string, string> = {};
    for (const t of [1, 2, 3, 4]) if (manifest[syllableKey(r.py_base, t)]) audio[t] = syllableKey(r.py_base, t);
    if (Object.keys(audio).length) r.audio = audio;
    else delete r.audio;
  }
  const head = fs.readFileSync(SYL, 'utf8').split('\n').filter((l) => l.startsWith('#')).join('\n');
  fs.writeFileSync(SYL, `${head}\n${rows.map((r) => `- ${JSON.stringify(r)}`).join('\n')}\n`);
  const bytes = todo.reduce((n, t) => n + fs.statSync(path.join(AUDIO_OUT, manifest[syllableKey(t.base, t.tone)].file)).size, 0);
  console.log(`audio:syllables — ${todo.length} syllable clips, ${(bytes / 1e6).toFixed(1)} MB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
