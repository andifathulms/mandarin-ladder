// Shared by audio:ingest and audio:syllables: ffmpeg processing and the manifest.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import type { Manifest } from '../lib/speech/audio';

const run = promisify(execFile);
export const AUDIO_OUT = path.join(process.cwd(), 'public', 'audio');
export const MANIFEST = path.join(AUDIO_OUT, 'manifest.json');

export function hasFfmpeg(): boolean {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    execFileSync('ffprobe', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function readManifest(): Manifest {
  return fs.existsSync(MANIFEST) ? (JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) as Manifest) : {};
}

export function writeManifest(m: Manifest) {
  const sorted = Object.fromEntries(Object.entries(m).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(MANIFEST, `${JSON.stringify(sorted, null, 1)}\n`);
}

/**
 * Trims silence, normalises loudness to −16 LUFS, converts to mono 48 kbps MP3 (CLAUDE.md §4), and names
 * the file <stem>-<content hash>.mp3 so caches never serve a stale clip. Returns the file name and duration.
 */
export async function processClip(src: string, stem: string): Promise<{ file: string; dur: number }> {
  fs.mkdirSync(AUDIO_OUT, { recursive: true });
  const tmp = path.join(AUDIO_OUT, `.${stem}.tmp.mp3`);
  await run('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', src,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.3,loudnorm=I=-16:TP=-1.5:LRA=11',
    '-ac', '1', '-ar', '44100', '-b:a', '48k', tmp,
  ]);
  const hash = crypto.createHash('sha1').update(fs.readFileSync(tmp)).digest('hex').slice(0, 8);
  const file = `${stem}-${hash}.mp3`;
  fs.renameSync(tmp, path.join(AUDIO_OUT, file));
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(AUDIO_OUT, file)]);
  return { file, dur: Math.round(Number(stdout) * 1000) };
}

/** Runs tasks with a concurrency limit. */
export async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) await fn(items[i++]);
    }),
  );
}
