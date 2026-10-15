// Web Speech API wrapper: the fallback when no recording exists. Resolves silently when speech is unavailable.

export type VoiceGender = 'female' | 'male';
type Opts = { gender?: VoiceGender; rate?: number; onBoundary?: (charIndex: number) => void };

let voices: SpeechSynthesisVoice[] = [];
let listening = false;

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

function refreshVoices() {
  const s = synth();
  if (!s) return;
  voices = s.getVoices();
  if (!listening) {
    listening = true;
    s.addEventListener?.('voiceschanged', () => {
      voices = s.getVoices();
      for (const l of changeListeners) l();
    });
  }
}

const changeListeners = new Set<() => void>();
/** Notifies when voices load (they arrive asynchronously in most browsers). */
export function onVoicesChanged(l: () => void) {
  refreshVoices();
  changeListeners.add(l);
  return () => changeListeners.delete(l);
}

// Novelty and very old synthesis voices (macOS extras, eSpeak, Eloquence) sound robotic or blurry.
const NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|grandma|grandpa|rocko|shelley|eddy|flo|reed|sandy|espeak|compact)\b/i;
// Markers of the clearer neural or network voices.
const CLEAR = /\b(natural|neural|online|enhanced|premium|siri)\b|^google\b/i;
// Mainland Mandarin voice names on common platforms (macOS, Windows, Android, Edge).
const FEMALE = /\b(female|woman|ting-?ting|xiaoxiao|xiaoyi|xiaohan|xiaomeng|xiaomo|xiaorui|xiaoshuang|xiaoxuan|xiaoyan|huihui|yaoyao|lili|yu-?shu|mei-?jia|sin-?ji)\b/i;
const MALE = /\b(male|man|yunxi|yunyang|yunjian|yunze|yunfeng|yunhao|yunye|kangkang|li-?mu)\b/i;

const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();

/**
 * Higher is better. Mandarin only: zh-CN first, then cmn-* and other zh-* except Hong Kong and
 * Taiwan (Cantonese, or Taiwanese Mandarin with different tones and vocabulary); never yue.
 * Then a clear voice, then the preferred gender; novelty voices are pushed out.
 */
export function scoreVoice(v: SpeechSynthesisVoice, gender: VoiceGender = 'female'): number {
  const lang = norm(v);
  if (lang.startsWith('yue') || lang === 'zh-hk' || lang === 'zh-tw' || lang === 'zh-mo') return -Infinity;
  if (!(lang.startsWith('zh') || lang.startsWith('cmn'))) return -Infinity;
  let score = lang === 'zh-cn' || lang === 'cmn-hans-cn' || lang === 'cmn-cn' ? 300 : lang.startsWith('cmn') ? 260 : lang === 'zh' || lang === 'zh-hans' ? 240 : 150;
  const name = v.name;
  if (NOVELTY.test(name)) score -= 1000;
  if (CLEAR.test(name)) score += 60;
  // "Female" names win over "male" substrings.
  const isFemale = FEMALE.test(name);
  const isMale = !isFemale && MALE.test(name);
  if (gender === 'female' ? isFemale : isMale) score += 40;
  if (gender === 'female' ? isMale : isFemale) score -= 20;
  if (v.default) score += 5;
  return score;
}

export function pickVoice(list: SpeechSynthesisVoice[], gender: VoiceGender = 'female'): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -Infinity;
  for (const v of list) {
    const s = scoreVoice(v, gender);
    if (s > bestScore) {
      best = v;
      bestScore = s;
    }
  }
  return bestScore > -Infinity ? best : null;
}

/** Splits long text at sentence ends (。！？； and Latin): some engines cut off or slur long utterances. */
export function chunks(text: string, max = 80): { text: string; start: number }[] {
  if (text.length <= max) return [{ text, start: 0 }];
  const out: { text: string; start: number }[] = [];
  const re = /[^。！？；.!?;]+[。！？；.!?;]+[”’」』)）]*\s*|[^。！？；.!?;]+$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const last = out[out.length - 1];
    if (last && last.text.length + m[0].length <= max) last.text += m[0];
    else out.push({ text: m[0], start: m.index });
  }
  return out.map((c) => ({ ...c, text: c.text.trimEnd() }));
}

/** The voice speak() would use now, for showing in Settings. */
export function chosenVoiceName(gender: VoiceGender = 'female'): string | null {
  if (!synth()) return null;
  refreshVoices();
  return pickVoice(voices, gender)?.name ?? null;
}

/** True when the browser can speak Mandarin. */
export function canSpeak(): boolean {
  if (!synth()) return false;
  refreshVoices();
  return pickVoice(voices) !== null;
}

let current: SpeechSynthesisUtterance | null = null;
/** Bumped on every new speak() or stop, so a cancelled reading never continues. */
let generation = 0;

export function stopSpeaking() {
  generation += 1;
  synth()?.cancel();
  current = null;
}

export function speak(text: string, opts: Opts = {}): Promise<void> {
  const s = synth();
  if (!s) return Promise.resolve();
  refreshVoices();
  const voice = pickVoice(voices, opts.gender);
  if (!voice) return Promise.resolve();
  s.cancel();
  const mine = ++generation;
  const parts = chunks(text);
  const say = (i: number): Promise<void> =>
    new Promise((resolve) => {
      const part = parts[i];
      const u = new SpeechSynthesisUtterance(part.text);
      u.voice = voice;
      u.lang = voice.lang;
      u.rate = (opts.rate ?? 1) * 0.9;
      u.pitch = 1;
      u.volume = 1;
      if (opts.onBoundary) {
        u.onboundary = (e) => {
          if (e.name === 'word' || e.name === undefined) opts.onBoundary!(part.start + e.charIndex);
        };
      }
      let finished = false;
      const done = (ok: boolean) => {
        if (finished) return;
        finished = true;
        if (current === u) current = null;
        if (ok && i + 1 < parts.length && mine === generation) resolve(say(i + 1));
        else resolve();
      };
      u.onend = () => done(true);
      u.onerror = () => done(false);
      current = u;
      s.speak(u);
    });
  return say(0);
}
