'use client';

import { useEffect, useRef, useState } from 'react';
import { CHAO } from '@/lib/zh/contour';
import { markSyllable, type Tone } from '@/lib/zh/pinyin';
import { syllableKey } from '@/lib/speech/audio';
import { useRoving } from './useRoving';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';
import { pyDisplay } from '../zh/Pinyin';
import { PlayButton } from '../lesson/PlayButton';
import { usePlay } from '../useSpeech';
import { useReducedMotion, useT } from '../ProgressProvider';

const TONES: Tone[] = [1, 2, 3, 4, 0];
const W = 360;
const H = 200;
const PAD_L = 44;
const PAD_R = 16;
const PAD_Y = 22;
const x = (t: number) => PAD_L + t * (W - PAD_L - PAD_R);
const y = (p: number) => PAD_Y + ((5 - p) / 4) * (H - PAD_Y * 2);

/** The contour of one tone as an SVG path over unit time. */
export function tonePath(tone: Tone): string {
  const pts = CHAO[tone];
  if (pts.length === 1) return `M${x(0.42)},${y(pts[0])} L${x(0.58)},${y(pts[0])}`;
  // A smooth curve through the targets.
  const P = pts.map((p, i) => [x(0.08 + (0.84 * i) / (pts.length - 1)), y(p)]);
  if (P.length === 2) return `M${P[0][0]},${P[0][1]} L${P[1][0]},${P[1][1]}`;
  return `M${P[0][0]},${P[0][1]} Q${P[1][0]},${P[1][1] + 18} ${P[2][0]},${P[2][1]}`;
}

const TONE_WORD: Record<Tone, { id: string; en: string; chao: string }> = {
  1: { id: 'tinggi datar', en: 'high and level', chao: '55' },
  2: { id: 'naik', en: 'rising', chao: '35' },
  3: { id: 'turun lalu naik', en: 'dipping', chao: '214' },
  4: { id: 'turun tajam', en: 'falling', chao: '51' },
  0: { id: 'netral, pendek dan ringan', en: 'neutral, short and light', chao: '·' },
};

type State = { tone: Tone; base: string };
type Props = VisualProps<State> & {
  initial?: State;
  /** Syllables to pick from. */
  syllables?: string[];
  /** Overlay a second syllable, dashed. */
  compare?: boolean;
};

/**
 * ToneContour (DESIGN §8.1): the five-level pitch scale with the four citation contours (55, 35, 214, 51)
 * and the neutral tone. Picking a tone draws its contour while the recorded syllable plays.
 */
export function ToneContour({ state, interactive = true, onStateChange, lang, initial, syllables = ['ma', 'ba', 'yi', 'shi', 'wu'], compare = false }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const play = usePlay();
  const { syllables: table } = useVisualData();
  const [own, setOwn] = useState<State>(initial ?? { tone: 1, base: syllables[0] });
  const cur = state ?? own;
  const [other, setOther] = useState<Tone>(3);
  const [drawKey, setDrawKey] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const set = (s: State) => {
    setOwn(s);
    onStateChange?.(s);
    setDrawKey((k) => k + 1);
  };
  const tones = useRoving(TONES, cur.tone, (tone) => set({ ...cur, tone }));
  const bases = useRoving(syllables, cur.base, (base) => set({ ...cur, base }));
  const exists = (base: string, tone: Tone) => tone === 0 || !table.length || table.find((r) => r.b === base)?.t.includes(tone);
  const key = cur.tone ? syllableKey(cur.base, cur.tone) : null;

  // Draw the contour in time with the syllable (contour motion: 600ms, linear).
  useEffect(() => {
    const el = pathRef.current;
    if (!el || reduced || typeof el.animate !== 'function' || typeof el.getTotalLength !== 'function') return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 600, easing: 'linear', fill: 'forwards' });
  }, [drawKey, reduced]);

  const label = `${pyDisplay(markSyllable(cur.base, cur.tone))}: ${t('tone.n', { n: cur.tone || t('tone.neutral') })}, ${TONE_WORD[cur.tone][lang]} (${TONE_WORD[cur.tone].chao})`;

  return (
    <div className="flex flex-col gap-4" data-visual="tone-contour">
      <div className="flex items-start gap-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[420px]" role="img" aria-label={label}>
          {[1, 2, 3, 4, 5].map((p) => (
            <g key={p}>
              <line x1={PAD_L - 6} x2={W - PAD_R} y1={y(p)} y2={y(p)} style={{ stroke: 'var(--rule)', strokeWidth: 1 }} />
              <text x={PAD_L - 14} y={y(p) + 4} textAnchor="end" className="font-mono" style={{ fill: 'var(--muted)', fontSize: 11 }}>
                {p}
              </text>
            </g>
          ))}
          {compare && (
            <path d={tonePath(other)} fill="none" style={{ stroke: `var(--tone-${other})`, strokeWidth: 4, strokeLinecap: 'round', strokeDasharray: '8 8', opacity: 0.8 }} />
          )}
          <path
            key={drawKey}
            ref={pathRef}
            d={tonePath(cur.tone)}
            fill="none"
            style={{ stroke: `var(--tone-${cur.tone})`, strokeWidth: cur.tone === 0 ? 10 : 4, strokeLinecap: 'round', strokeLinejoin: 'round' }}
          />
        </svg>
      </div>
      <p className="flex items-center gap-3">
        <span lang="zh-Latn-pinyin" className={`py text-h1 tone-${cur.tone}`}>
          {pyDisplay(markSyllable(cur.base, cur.tone))}
        </span>
        <span className="text-small text-muted">
          {TONE_WORD[cur.tone][lang]} · <span className="font-mono">{TONE_WORD[cur.tone].chao}</span>
        </span>
        {key && exists(cur.base, cur.tone) && (
          <PlayButton
            text={key}
            onPlay={() => {
              setDrawKey((k) => k + 1);
              void play(key);
            }}
            label={t('audio.playText', { text: markSyllable(cur.base, cur.tone) })}
          />
        )}
      </p>
      <p className="sr-only" aria-live="polite">
        {label}
      </p>
      {interactive && (
        <div className="flex flex-col gap-3">
          <div role="radiogroup" aria-label={t('tone.pick')} className="flex flex-wrap gap-2" onKeyDown={tones.onKeyDown}>
            {TONES.map((tone, i) => (
              <button
                key={tone}
                type="button"
                {...tones.itemProps(tone, i)}
                aria-label={t('tone.n', { n: tone || t('tone.neutral') })}
                className={`flex min-h-touch min-w-[64px] flex-col items-center rounded-md border-2 px-3 py-1 transition-colors duration-quick ${
                  tone === cur.tone ? 'border-accent bg-accent-soft' : 'border-rule bg-surface'
                }`}
              >
                <svg viewBox={`0 0 ${W} ${H}`} width={48} height={27} aria-hidden>
                  <path d={tonePath(tone)} fill="none" style={{ stroke: `var(--tone-${tone})`, strokeWidth: tone === 0 ? 30 : 16, strokeLinecap: 'round' }} />
                </svg>
                <span className="font-mono text-small">{tone || '·'}</span>
              </button>
            ))}
          </div>
          <div role="radiogroup" aria-label={t('tone.syllable')} className="flex flex-wrap gap-2" onKeyDown={bases.onKeyDown}>
            {syllables.map((b, i) => (
              <button
                key={b}
                type="button"
                {...bases.itemProps(b, i)}
                lang="zh-Latn-pinyin"
                className={`min-h-touch rounded-full border-2 px-4 font-body ${b === cur.base ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'}`}
              >
                {b}
              </button>
            ))}
          </div>
          {compare && (
            <label className="flex items-center gap-2 text-small">
              {t('tone.compareWith')}
              <select value={other} onChange={(e) => setOther(Number(e.target.value) as Tone)} className="min-h-touch rounded-sm border border-rule bg-surface px-2">
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {t('tone.n', { n })}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
}
