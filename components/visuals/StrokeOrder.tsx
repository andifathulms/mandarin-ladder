'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { classifyStroke, length, medianPath, STROKE_NAMES, toScreen, type StrokeName } from '@/lib/zh/trace';
import { useStrokes } from '../zh/useStrokes';
import { useVisualData } from './VisualData';
import { useReducedMotion, useSettings, useT } from '../ProgressProvider';
import { IconPlay } from '../ui/Icon';
import type { VisualProps } from './types';

/** The 田字格 (and optionally 米字格) behind a character, in the 1024 grid. */
export function PracticeGrid({ mizi = false }: { mizi?: boolean }) {
  const s = { stroke: 'var(--grid-line)', strokeWidth: 6 };
  const d = { ...s, strokeDasharray: '24 20' };
  return (
    <g aria-hidden>
      <rect x="3" y="3" width="1018" height="1018" fill="none" style={s} />
      <line x1="0" y1="512" x2="1024" y2="512" style={d} />
      <line x1="512" y1="0" x2="512" y2="1024" style={d} />
      {mizi && (
        <>
          <line x1="0" y1="0" x2="1024" y2="1024" style={d} />
          <line x1="1024" y1="0" x2="0" y2="1024" style={d} />
        </>
      )}
    </g>
  );
}

/** Stroke names for a character: authored ones win, else the heuristic. */
export function useStrokeNames(ch: string, medians: number[][][] | undefined): StrokeName[] {
  const { strokeNames } = useVisualData();
  return useMemo(() => strokeNames[ch] ?? (medians ?? []).map((m) => classifyStroke(m as [number, number][])), [ch, medians, strokeNames]);
}

type Props = Partial<VisualProps<number>> & {
  char: string;
  /** Pixel size of the square. */
  size?: number;
  controls?: boolean;
  mizi?: boolean;
  /** Play once on mount. */
  autoplay?: boolean;
};

/**
 * StrokeOrder (DESIGN §8.5): the character in the practice grid, drawn stroke by stroke along its
 * medians (a thick median path masked by the stroke outline). Drawn strokes are --ink, the current one
 * --accent, the guide --rule; numbers sit at each stroke's start. Play/pause, step, speed, and the
 * stroke names beneath with the current one highlighted. With reduced motion strokes appear whole.
 */
export function StrokeOrder({ char, size = 240, controls = true, mizi = false, autoplay = false, lang }: Props) {
  const { t, lang: uiLang } = useT();
  const L = lang ?? uiLang;
  const data = useStrokes(char);
  const reduced = useReducedMotion();
  const { rate } = useSettings();
  const [speed, setSpeed] = useState<0.75 | 1>(rate === 0.75 ? 0.75 : 1);
  const [shown, setShown] = useState(0); // strokes fully drawn
  const [playing, setPlaying] = useState(autoplay);
  const [animating, setAnimating] = useState<number | null>(null);
  const uid = useId().replace(/:/g, '');
  const pathRef = useRef<SVGPathElement>(null);
  const names = useStrokeNames(char, data?.medians);
  const n = data?.medians.length ?? 0;

  // Drive playback: animate the next stroke, then count it as shown.
  useEffect(() => {
    if (!playing || !data) return;
    if (shown >= n) {
      setPlaying(false);
      return;
    }
    setAnimating(shown);
  }, [playing, shown, n, data]);

  useEffect(() => {
    if (animating === null || !data) return;
    const el = pathRef.current;
    const dur = reduced ? 0 : speed === 0.75 ? 600 : 450;
    if (!el || dur === 0 || typeof el.animate !== 'function') {
      const id = setTimeout(() => {
        setShown((s) => Math.max(s, animating + 1));
        setAnimating(null);
      }, reduced ? 350 / speed : 0);
      return () => clearTimeout(id);
    }
    const len = length(data.medians[animating].map((p) => toScreen(p as [number, number]))) + 120;
    const anim = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' });
    anim.onfinish = () => {
      setShown((s) => Math.max(s, animating + 1));
      setAnimating(null);
    };
    return () => anim.cancel();
  }, [animating, data, reduced, speed]);

  const play = () => {
    if (shown >= n) setShown(0);
    setPlaying(true);
  };
  const step = (d: number) => {
    setPlaying(false);
    setAnimating(null);
    setShown((s) => Math.min(n, Math.max(0, s + d)));
  };

  const current = animating ?? (shown > 0 ? shown - 1 : null);
  const label = data ? t('strokes.label', { ch: char, n }) : char;

  return (
    <div className="flex flex-col items-center gap-3" data-visual="stroke-order">
      <svg width={size} height={size} viewBox="0 0 1024 1024" role="img" aria-label={label} className="rounded-md bg-surface">
        <PracticeGrid mizi={mizi} />
        {data && (
          <g>
            <defs>
              {data.strokes.map((d, i) => (
                <clipPath key={i} id={`so-${uid}-${i}`}>
                  <path d={d} transform="translate(0 900) scale(1 -1)" />
                </clipPath>
              ))}
            </defs>
            {/* Guide */}
            <g transform="translate(0 900) scale(1 -1)">
              {data.strokes.map((d, i) => (
                <path key={i} d={d} style={{ fill: 'var(--rule)' }} />
              ))}
              {data.strokes.slice(0, shown).map((d, i) => (
                <path key={`s${i}`} d={d} style={{ fill: i === shown - 1 && animating === null && playing ? 'var(--accent)' : 'var(--ink)' }} />
              ))}
            </g>
            {animating !== null && (
              <path
                ref={pathRef}
                key={`a${animating}`}
                d={medianPath(data.medians[animating] as [number, number][])}
                clipPath={`url(#so-${uid}-${animating})`}
                style={{
                  fill: 'none',
                  stroke: 'var(--accent)',
                  strokeWidth: 130,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  strokeDasharray: length(data.medians[animating].map((p) => toScreen(p as [number, number]))) + 120,
                  strokeDashoffset: reduced ? 0 : length(data.medians[animating].map((p) => toScreen(p as [number, number]))) + 120,
                }}
              />
            )}
            {/* Stroke numbers at start points, mono 10px */}
            {data.medians.slice(0, Math.max(shown, (animating ?? -1) + 1)).map((m, i) => {
              const [x, y] = toScreen(m[0] as [number, number]);
              return (
                <text key={i} x={x} y={y} className="font-mono" style={{ fill: 'var(--muted)', fontSize: (10 * 1024) / size, fontWeight: 500 }} dx={-20} dy={-14}>
                  {i + 1}
                </text>
              );
            })}
          </g>
        )}
      </svg>
      {data === null && <p className="text-small text-muted">{t('strokes.none')}</p>}
      {controls && data && (
        <>
          <div className="flex flex-wrap items-center justify-center gap-1" role="group" aria-label={t('strokes.controls')}>
            <button type="button" className="btn btn-quiet min-h-touch px-3" onClick={() => step(-1)} disabled={shown === 0} aria-label={t('strokes.back')}>
              ‹
            </button>
            <button type="button" className="btn btn-primary min-h-touch px-4" onClick={playing ? () => setPlaying(false) : play} aria-label={playing ? t('strokes.pause') : t('strokes.play')}>
              {playing ? '❚❚' : <IconPlay size={18} />}
            </button>
            <button type="button" className="btn btn-quiet min-h-touch px-3" onClick={() => step(1)} disabled={shown >= n} aria-label={t('strokes.forward')}>
              ›
            </button>
            <button
              type="button"
              className="btn btn-ghost min-h-touch px-3 font-mono text-small"
              aria-pressed={speed === 0.75}
              onClick={() => setSpeed(speed === 1 ? 0.75 : 1)}
              aria-label={t('strokes.speed')}
            >
              {speed === 1 ? '1×' : '0.75×'}
            </button>
          </div>
          <ol className="flex flex-wrap justify-center gap-1" aria-label={t('strokes.names')}>
            {names.map((nm, i) => {
              const s = STROKE_NAMES[nm];
              const on = current === i;
              return (
                <li
                  key={i}
                  aria-current={on ? 'step' : undefined}
                  className={`flex flex-col items-center rounded-sm px-2 py-1 ${on ? 'bg-accent-soft text-accent' : i < shown ? 'text-ink' : 'text-muted'}`}
                >
                  <span className="label tnum">{i + 1}</span>
                  <span lang="zh-Hans" className="zh font-zh-ui text-small">
                    {s.zh}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="sr-only" aria-live="polite">
            {current !== null && names[current] ? t('strokes.announce', { n: current + 1, total: n, name: `${STROKE_NAMES[names[current]].zh} ${STROKE_NAMES[names[current]].py}, ${STROKE_NAMES[names[current]][L]}` }) : ''}
          </p>
        </>
      )}
    </div>
  );
}
