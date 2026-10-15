// Recorded audio first, browser speech second (CLAUDE.md §7.7, PRD §5.6).
import { stripMarkup } from '../markup';
import { withBase } from '../basePath';
import { normZh, plainZh } from '../zh/text';
import { sha1 } from './sha1';
import { canSpeak, speak, stopSpeaking, type VoiceGender } from './speak';

export type ManifestEntry = { file: string; dur: number; words?: number[] };
export type Manifest = Record<string, ManifestEntry>;

/** A syllable's recording key: syl-<base><tone>, e.g. syl-ma3, syl-lü4. */
export const syllableKey = (base: string, tone: number) => `syl-${base}${tone}`;
export const isSyllableKey = (s: string) => /^syl-[a-zü]+[0-4]$/.test(s);

/** The audio key for Chinese text: sha1(normZh(text)), first 12 hex digits. */
export function audioKey(text: string): string {
  return isSyllableKey(text) ? text : sha1(normZh(stripMarkup(text))).slice(0, 12);
}

let manifest: Manifest | null = null;
let loading: Promise<Manifest> | null = null;
const listeners = new Set<() => void>();

/** Loads public/audio/manifest.json once. Missing or broken manifests count as empty. */
export function loadManifest(): Promise<Manifest> {
  if (manifest) return Promise.resolve(manifest);
  if (!loading) {
    loading =
      typeof fetch === 'undefined'
        ? Promise.resolve({})
        : fetch(withBase('/audio/manifest.json'))
            .then((r) => (r.ok ? r.json() : {}))
            .catch(() => ({}))
            .then((m: Manifest) => {
              manifest = m && typeof m === 'object' ? m : {};
              for (const l of listeners) l();
              return manifest;
            });
  }
  return loading;
}

export function onManifest(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Test helper. */
export function __setManifest(m: Manifest | null) {
  manifest = m;
  loading = m ? Promise.resolve(m) : null;
  for (const l of listeners) l();
}

export function audioFor(text: string): ManifestEntry | null {
  return manifest?.[audioKey(text)] ?? null;
}

/**
 * True if a recording exists, or (for text) the browser has a Chinese voice. Isolated syllables
 * never fall back to speech: their play button hides without a recording (CLAUDE.md §7.7).
 */
export function canPlay(text: string): boolean {
  if (audioFor(text)) return true;
  return !isSyllableKey(text) && canSpeak();
}

type PlayOpts = {
  rate?: number;
  gender?: VoiceGender;
  /** Recordings with word timings: the index of the word being spoken. */
  onWord?: (index: number) => void;
  /** Browser speech: the character offset of the boundary in the played text. */
  onChar?: (charIndex: number) => void;
};

let el: HTMLAudioElement | null = null;
let stopCurrent: (() => void) | null = null;

export function stop() {
  stopCurrent?.();
  stopCurrent = null;
  stopSpeaking();
}

/**
 * Plays text (or a syllable key). A recording goes through one shared audio element with pitch
 * preserved at the chosen rate, reporting word indexes from the manifest timings. Otherwise browser
 * speech reads the characters, reporting character offsets from boundary events.
 */
export async function play(text: string, opts: PlayOpts = {}): Promise<void> {
  await loadManifest();
  stop();
  const entry = audioFor(text);
  if (entry && typeof Audio !== 'undefined') {
    el ??= new Audio();
    const a = el;
    a.src = withBase(`/audio/${entry.file}`);
    a.playbackRate = opts.rate ?? 1;
    (a as HTMLAudioElement & { preservesPitch?: boolean }).preservesPitch = true;
    return new Promise<void>((resolve) => {
      let last = -1;
      const onTime = () => {
        if (!entry.words || !opts.onWord) return;
        const ms = a.currentTime * 1000;
        let k = -1;
        for (let i = 0; i < entry.words.length; i++) if (entry.words[i] <= ms) k = i;
        if (k !== last) opts.onWord((last = k));
      };
      const finish = () => {
        a.removeEventListener('timeupdate', onTime);
        a.removeEventListener('ended', finish);
        a.removeEventListener('error', finish);
        stopCurrent = null;
        resolve();
      };
      stopCurrent = () => {
        a.pause();
        finish();
      };
      a.addEventListener('timeupdate', onTime);
      a.addEventListener('ended', finish);
      a.addEventListener('error', finish);
      a.play().catch(finish);
    });
  }
  if (isSyllableKey(text)) return;
  return speak(plainZh(stripMarkup(text)), { rate: opts.rate, gender: opts.gender, onBoundary: opts.onChar });
}
