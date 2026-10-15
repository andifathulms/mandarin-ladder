// Recorded audio first, browser speech second (CLAUDE.md §7.7, PRD §5.6).
import { normalise, tokenise } from '../arabic/text';
import { stripMarkup } from '../markup';
import { withBase } from '../basePath';
import { sha1 } from './sha1';
import { canSpeak, speak, stopSpeaking, type Variety, type VoiceGender } from './speak';

export type { Variety };

export type ManifestEntry = { file: string; dur: number; words?: number[] };
export type Manifest = Record<string, ManifestEntry>;

/** The audio key for a string: sha1(normalise(text) + '|' + variety), first 12 hex digits. */
export function audioKey(text: string, variety: Variety = 'fusha'): string {
  return sha1(`${normalise(stripMarkup(text))}|${variety}`).slice(0, 12);
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

export function audioFor(text: string, variety: Variety = 'fusha'): ManifestEntry | null {
  return manifest?.[audioKey(text, variety)] ?? null;
}

/** True if a recording exists or the browser has an Arabic voice. Play buttons hide otherwise. */
export function canPlay(text: string, variety: Variety = 'fusha'): boolean {
  return !!audioFor(text, variety) || canSpeak();
}

type PlayOpts = { variety?: Variety; rate?: number; gender?: VoiceGender; onWord?: (index: number) => void };

let el: HTMLAudioElement | null = null;
let stopCurrent: (() => void) | null = null;

export function stop() {
  stopCurrent?.();
  stopCurrent = null;
  stopSpeaking();
}

/**
 * Plays a string. A recording goes through one shared audio element with pitch preserved at the
 * chosen rate, reporting word indexes from the manifest timings. Otherwise browser speech, which
 * reports word indexes from boundary events when the engine fires them.
 */
export async function play(text: string, opts: PlayOpts = {}): Promise<void> {
  const variety = opts.variety ?? 'fusha';
  const plain = stripMarkup(text);
  await loadManifest();
  stop();
  const entry = audioFor(plain, variety);
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
  const words = tokenise(plain);
  return speak(plain, {
    variety,
    rate: opts.rate,
    gender: opts.gender,
    onBoundary: opts.onWord
      ? (ci) => {
          const k = words.findIndex((w) => ci >= w.start && ci < w.end);
          if (k >= 0) opts.onWord!(k);
        }
      : undefined,
  });
}
