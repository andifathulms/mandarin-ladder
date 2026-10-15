'use client';

import { useEffect, useRef, useState } from 'react';
import { showHint, startTrace, totalMisses, traceStep, type Point, type StrokeData, type TraceState } from '@/lib/zh/trace';
import { PracticeGrid } from '../visuals/StrokeOrder';
import { useReducedMotion, useT } from '../ProgressProvider';

type Props = {
  data: StrokeData;
  /** Show the character as a faint guide (it can be hidden at higher rungs). */
  guide?: boolean;
  /** Called once when the last stroke is drawn, with the total misses. */
  onDone: (misses: number) => void;
  /** Called after each judged stroke (for live counts and tests). */
  onStroke?: (s: TraceState, ok: boolean) => void;
  disabled?: boolean;
};

/** Pointer position in grid units (0–1024), screen space (y down). */
function gridPoint(svg: SVGSVGElement, e: { clientX: number; clientY: number }): Point {
  const r = svg.getBoundingClientRect();
  return [((e.clientX - r.left) / r.width) * 1024, ((e.clientY - r.top) / r.height) * 1024];
}

/**
 * The tracing surface (DESIGN §6.7): a 田字格 grid on --surface, 280px on phones and 320px wider, with
 * the character as a faint guide. Each stroke is judged as it ends: a correct one snaps to its true
 * shape in --ink; a wrong one flashes --off and fades; after two misses the expected stroke pulses in
 * --accent. Pointer events with touch-action: none; pen pressure ignored; coalesced events used.
 */
export function TracePad({ data, guide = true, onDone, onStroke, disabled }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<TraceState>(() => startTrace(data.medians.length));
  const [line, setLine] = useState<Point[]>([]);
  const [flash, setFlash] = useState<Point[] | null>(null);
  const [message, setMessage] = useState('');
  const drawing = useRef<Point[] | null>(null);
  const pointerId = useRef<number | null>(null);
  const reported = useRef(false);

  useEffect(() => {
    setState(startTrace(data.medians.length));
    reported.current = false;
  }, [data]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 300);
    return () => clearTimeout(id);
  }, [flash]);

  const finish = (pts: Point[]) => {
    if (pts.length < 2) return;
    const { state: next, judgement } = traceStep(state, pts, data.medians as Point[][]);
    setState(next);
    onStroke?.(next, judgement.result === 'pass');
    if (judgement.result === 'pass') {
      setMessage(next.done ? t('trace.done') : t('trace.good', { n: next.k, total: data.medians.length }));
    } else {
      setFlash(pts);
      setMessage(judgement.why === 'order' ? t('trace.order') : t('trace.miss'));
    }
    if (next.done && !reported.current) {
      reported.current = true;
      onDone(totalMisses(next));
    }
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (disabled || state.done || pointerId.current !== null) return;
    pointerId.current = e.pointerId;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = gridPoint(e.currentTarget, e);
    drawing.current = [p];
    setLine([p]);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerId.current !== e.pointerId || !drawing.current) return;
    const native = e.nativeEvent as PointerEvent & { getCoalescedEvents?: () => PointerEvent[] };
    const events = native.getCoalescedEvents?.() ?? [native];
    for (const ev of events.length ? events : [native]) drawing.current.push(gridPoint(e.currentTarget, ev));
    setLine([...drawing.current]);
  };
  const end = (e: React.PointerEvent<SVGSVGElement>) => {
    if (pointerId.current !== e.pointerId) return;
    pointerId.current = null;
    const pts = drawing.current ?? [];
    drawing.current = null;
    setLine([]);
    finish(pts);
  };

  const hint = showHint(state);
  const poly = (pts: Point[]) => pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' ');

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="label tnum text-muted" aria-hidden>
        {Math.min(state.k + (state.done ? 0 : 1), data.medians.length)} / {data.medians.length}
      </p>
      <svg
        ref={svgRef}
        viewBox="0 0 1024 1024"
        className="h-[280px] w-[280px] touch-none select-none rounded-md bg-surface shadow-e1 min-[640px]:h-[320px] min-[640px]:w-[320px]"
        style={{ touchAction: 'none' }}
        role="img"
        aria-label={t('trace.pad', { n: data.medians.length })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={end}
        onPointerCancel={end}
        data-trace-pad
      >
        <PracticeGrid />
        <g transform="translate(0 900) scale(1 -1)">
          {guide && data.strokes.map((d, i) => <path key={i} d={d} style={{ fill: 'var(--rule)' }} />)}
          {data.strokes.slice(0, state.k).map((d, i) => (
            <path key={`d${i}`} d={d} className={i === state.k - 1 && !reduced ? 'fade-in' : undefined} style={{ fill: 'var(--ink)' }} />
          ))}
          {hint && (
            <path d={data.strokes[state.k]} className={reduced ? undefined : 'hint-pulse'} style={{ fill: 'var(--accent)', opacity: 0.4 }} data-hint />
          )}
        </g>
        {line.length > 1 && <polyline points={poly(line)} style={{ fill: 'none', stroke: 'var(--ink)', strokeWidth: 36, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.7 }} />}
        {flash && <polyline points={poly(flash)} className="trace-miss" style={{ fill: 'none', stroke: 'var(--off)', strokeWidth: 36, strokeLinecap: 'round', strokeLinejoin: 'round' }} />}
      </svg>
      <p className="min-h-[1.5em] text-small text-muted" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
