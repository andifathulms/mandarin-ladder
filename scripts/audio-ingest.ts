/*
 * Imports recorded files from ./recordings (named <key>.<ext>, as listed by audio:list):
 * trims silence, normalises loudness to −16 LUFS, converts to mono 48 kbps MP3, names each file by
 * content hash, and updates public/audio/manifest.json. Needs ffmpeg and ffprobe on PATH.
 * Optional word timings: <key>.words.json holding an array of word start times in milliseconds.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readManifest } from './audio-list';
import type { Manifest } from '../lib/speech/audio';

const SRC = path.join(process.cwd(), 'recordings');
const OUT = path.join(process.cwd(), 'public', 'audio');

function has(bin: string): boolean {
  try {
    execFileSync(bin, ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!has('ffmpeg') || !has('ffprobe')) {
    console.error('audio:ingest needs ffmpeg and ffprobe on PATH (brew install ffmpeg).');
    process.exit(1);
  }
  if (!fs.existsSync(SRC)) {
    console.error('No ./recordings folder. Put <key>.wav files from the audio:list CSV there.');
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const manifest: Manifest = readManifest();
  let n = 0;
  for (const f of fs.readdirSync(SRC)) {
    const m = /^([0-9a-f]{12})\.(wav|mp3|m4a|flac|ogg|aiff?)$/i.exec(f);
    if (!m) continue;
    const key = m[1];
    const tmp = path.join(OUT, `.${key}.tmp.mp3`);
    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error', '-i', path.join(SRC, f),
      '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.3,loudnorm=I=-16:TP=-1.5:LRA=11',
      '-ac', '1', '-ar', '44100', '-b:a', '48k', tmp,
    ]);
    const hash = crypto.createHash('sha1').update(fs.readFileSync(tmp)).digest('hex').slice(0, 8);
    const file = `${key}-${hash}.mp3`;
    const old = manifest[key]?.file;
    if (old && old !== file && fs.existsSync(path.join(OUT, old))) fs.unlinkSync(path.join(OUT, old));
    fs.renameSync(tmp, path.join(OUT, file));
    const dur = Math.round(
      Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(OUT, file)]).toString()) * 1000,
    );
    const wordsFile = path.join(SRC, `${key}.words.json`);
    const words = fs.existsSync(wordsFile) ? (JSON.parse(fs.readFileSync(wordsFile, 'utf8')) as number[]) : undefined;
    manifest[key] = { file, dur, ...(words ? { words } : {}) };
    n++;
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(sorted, null, 1)}\n`);
  console.log(`audio:ingest — ${n} recordings imported, ${Object.keys(sorted).length} in the manifest`);
}

main();
