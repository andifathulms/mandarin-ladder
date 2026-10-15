'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { BALL_R, PLACE_SPEC, isPlace, type Place, type Slot } from './placeLogic';
import { useReducedMotion } from '../ProgressProvider';

// Illustration tones (DESIGN §10). Light from the top-left: top lightest, front base, side darkest.
const WOOD_TOP = 'color-mix(in srgb, var(--wood) 70%, var(--card-top))';
const SUBJECT_LIGHT = 'color-mix(in srgb, var(--subject) 55%, var(--card-top))';
const SUBJECT_DARK = 'color-mix(in srgb, var(--subject) 75%, var(--ink))';
const f = (fill: string, extra: React.CSSProperties = {}) => ({ style: { fill, ...extra } });

function Ball({ place, from }: { place: Place; from: Place | null }) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGGElement>(null);
  const to = PLACE_SPEC[place];
  const start = from ? PLACE_SPEC[from] : to;

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    const target = `translate(${to.x}px, ${to.y}px)`;
    if (reduced || !from || from === place) {
      g.style.transform = target;
      return;
    }
    g.style.transition = 'none';
    g.style.transform = `translate(${start.x}px, ${start.y}px)`;
    const id = requestAnimationFrame(() => {
      g.style.transition = 'transform var(--m-object-d) var(--ease-object)';
      g.style.transform = target;
    });
    return () => cancelAnimationFrame(id);
  }, [place, from, reduced, to.x, to.y, start.x, start.y]);

  return (
    <g ref={ref} style={{ transform: `translate(${start.x}px, ${start.y}px)` }} data-ball={place}>
      {/* Ground shadow: smaller when the ball is lifted onto the box */}
      <ellipse
        cx={0}
        cy={BALL_R - 0.5}
        rx={to.lifted ? 8 : 13}
        ry={3.5}
        style={{ fill: 'var(--ink)', opacity: 0.12, transition: 'rx var(--m-object-d) var(--ease-object)' }}
      />
      <circle r={BALL_R} {...f(SUBJECT_DARK)} />
      <circle cx={-1.5} cy={-1.5} r={BALL_R - 1.5} {...f('var(--subject)')} />
      <ellipse cx={-BALL_R * 0.38} cy={-BALL_R * 0.42} rx={BALL_R * 0.3} ry={BALL_R * 0.2} transform="rotate(-35)" {...f(SUBJECT_LIGHT)} />
    </g>
  );
}

type DrawingProps = {
  place: Place;
  from: Place | null;
  /** Text alternative for the scene. */
  alt: string;
  /** Object labels drawn in the scene (e.g. table · طاولة · meja). */
  labels: { table: React.ReactNode; box: React.ReactNode };
};

/**
 * English Ladder's table, box and ball, unchanged in drawing, draw order and motion. The Arabic
 * visual (PlaceSceneAr) supplies its own labels, controls and sentence.
 */
export function PlaceDrawing({ place, from, alt, labels }: DrawingProps) {
  const slot: Slot = PLACE_SPEC[place].slot;
  const ball = (s: Slot) => (slot === s ? <Ball key={place} place={place} from={from} /> : null);
  const glass = place === 'in';
  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full" role="img" aria-label={alt}>
      <g transform="translate(-28 -80) scale(1.15)">
        {/* floor */}
        <line x1="16" y1="244.5" x2="384" y2="244.5" style={{ stroke: 'var(--rule)', strokeWidth: 1.5 }} />
        <ellipse cx="210" cy="240" rx="170" ry="9" style={{ fill: 'var(--ink)', opacity: 0.08 }} />
        {/* back legs */}
        <rect x="120" y="134" width="12" height="62" {...f('var(--wood-dark)')} />
        <rect x="348" y="134" width="12" height="62" {...f('var(--wood-dark)')} />

        {ball('under')}

        {/* table */}
        <polygon points="50,170 310,170 370,122 110,122" {...f(WOOD_TOP)} />
        <rect x="50" y="170" width="260" height="12" {...f('var(--wood)')} />
        <polygon points="310,170 370,122 370,134 310,182" {...f('var(--wood-dark)')} />
        <line x1="50" y1="170" x2="310" y2="170" style={{ stroke: 'var(--wood-dark)', strokeWidth: 1.5 }} />
        <rect x="60" y="182" width="12" height="62" {...f('var(--wood)')} />
        <rect x="288" y="182" width="12" height="62" {...f('var(--wood)')} />

        {/* box shadow on the table */}
        <ellipse cx="200" cy="150" rx="58" ry="6" style={{ fill: 'var(--ink)', opacity: 0.08 }} />

        {ball('behind')}

        {/* box: inner back first, so a ball "in" sits between back and see-through front */}
        <polygon points="148,124 168,108 252,108 252,136 232,152 148,152" {...f('var(--card-side)')} />

        {ball('inside')}

        <g style={{ opacity: glass ? 0.45 : 1, transition: 'opacity var(--m-base-d) var(--ease)' }}>
          <rect x="148" y="124" width="84" height="28" {...f('var(--card)')} />
          <polygon points="148,124 232,124 252,108 168,108" {...f('var(--card-top)')} />
        </g>
        <polygon points="232,124 252,108 252,136 232,152" {...f('var(--card-side)')} />
        <line x1="148" y1="124.5" x2="232" y2="124.5" style={{ stroke: 'var(--card-side)', strokeWidth: 1.5 }} />

        {ball('front')}

        <text x="40" y="258" className="font-mono" style={{ fill: 'var(--muted)', fontSize: 10.5 }}>
          {labels.table}
        </text>
        <text x="60" y="160" className="font-mono" style={{ fill: 'var(--muted)', fontSize: 11 }}>
          {labels.box}
        </text>
      </g>
    </svg>
  );
}

/** Tracks the previous place so the ball can travel from it. */
export function usePlace(initial: Place, state: Place | undefined, onStateChange?: (p: Place) => void) {
  const [own, setOwn] = useState<Place>(initial);
  const place = isPlace(state) ? state : own;
  const [from, setFrom] = useState<Place | null>(null);
  const set = (p: Place) => {
    if (p === place) return;
    setFrom(place);
    setOwn(p);
    onStateChange?.(p);
  };
  return { place, from, set };
}
