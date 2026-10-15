// Sound effects synthesised with the Web Audio API (DESIGN §9). No audio files.

export type SfxName = 'correct' | 'wrong' | 'lessonDone' | 'climbed';

let ctx: AudioContext | null = null;
let enabled = true;
let gestured = false;

export function setSfxEnabled(on: boolean) {
  enabled = on;
}

// Never play before the learner's first interaction.
if (typeof window !== 'undefined') {
  const mark = () => {
    gestured = true;
  };
  window.addEventListener('pointerdown', mark, { once: true, capture: true });
  window.addEventListener('keydown', mark, { once: true, capture: true });
}

function audio(): AudioContext | null {
  if (!gestured || typeof window === 'undefined') return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

const NOTE: Record<string, number> = {
  A3: 220,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  A5: 880,
  C6: 1046.5,
};

// Peak around −20 dBFS.
const PEAK = 0.1;

function tone(
  c: AudioContext,
  dest: AudioNode,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  peak = PEAK,
) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(peak, start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur + 0.08);
  o.connect(g).connect(dest);
  o.start(start);
  o.stop(start + dur + 0.1);
}

function reverb(c: AudioContext): AudioNode {
  // A short feedback delay standing in for a reverb tail.
  const input = c.createGain();
  const delay = c.createDelay();
  const fb = c.createGain();
  const wet = c.createGain();
  delay.delayTime.value = 0.09;
  fb.gain.value = 0.35;
  wet.gain.value = 0.4;
  input.connect(c.destination);
  input.connect(delay);
  delay.connect(fb).connect(delay);
  delay.connect(wet).connect(c.destination);
  return input;
}

export function sfx(name: SfxName) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime + 0.01;
  const out = c.destination;
  switch (name) {
    case 'correct':
      tone(c, out, NOTE.E5, t, 0.07);
      tone(c, out, NOTE.A5, t + 0.08, 0.07);
      break;
    case 'wrong':
      tone(c, out, NOTE.A3, t, 0.09, 'triangle', PEAK * 0.5);
      break;
    case 'lessonDone':
      ['C5', 'E5', 'G5'].forEach((n, i) => tone(c, out, NOTE[n], t + i * 0.11, 0.1));
      break;
    case 'climbed': {
      const r = reverb(c);
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => tone(c, r, NOTE[n], t + i * 0.14, i === 3 ? 0.4 : 0.12));
      break;
    }
  }
}
