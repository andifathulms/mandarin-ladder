import { useId } from 'react';

/**
 * The board pattern (DESIGN §9): a deterministic khatam lattice of eight-point stars, each two
 * overlapping squares at 45°, on a 72px grid, drawn as single strokes. Every fourth star is brass.
 * It fades out toward the inline-start edge so text on the board always sits on plain green.
 * Generated in code: no hand-written path data, no randomness.
 */
const GRID = 72;
const W = 720;
const H = 360;
const R = 30; // star radius: the two squares' circumradius

function square(cx: number, cy: number, r: number, rot: number): string {
  const pts = [0, 1, 2, 3].map((k) => {
    const a = rot + (k * Math.PI) / 2;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  });
  return `M${pts.join('L')}Z`;
}

/** One star: two squares, rotated 45° apart. */
export function star(cx: number, cy: number, r = R): string {
  return square(cx, cy, r, Math.PI / 4) + square(cx, cy, r, 0);
}

export type LatticeStar = { d: string; brass: boolean };

export function latticeStars(): LatticeStar[] {
  const out: LatticeStar[] = [];
  let i = 0;
  for (let y = 0; y <= H + GRID; y += GRID) {
    for (let x = 0; x <= W + GRID; x += GRID) {
      out.push({ d: star(x, y), brass: i % 4 === 3 });
      i++;
    }
  }
  return out;
}

const STARS = latticeStars();
// The interlace between stars: small squares on the cell corners join neighbours into one lattice.
const LINKS = (() => {
  const d: string[] = [];
  for (let y = GRID / 2; y <= H + GRID; y += GRID) {
    for (let x = GRID / 2; x <= W + GRID; x += GRID) d.push(square(x, y, (GRID - 2 * R * Math.cos(Math.PI / 4)) / 1.2, Math.PI / 4));
  }
  return d.join('');
})();

export function Lattice({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden
      focusable={false}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        {/* 100% at the inline-end edge, 0% at 55% across: the shell is LTR, so end is right. */}
        <linearGradient id={`lf-${id}`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`lm-${id}`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#lf-${id})`} />
        </mask>
      </defs>
      <g mask={`url(#lm-${id})`} fill="none" strokeWidth={1}>
        <path d={STARS.filter((s) => !s.brass).map((s) => s.d).join('')} stroke="var(--board-ink)" strokeOpacity={0.07} />
        <path d={STARS.filter((s) => s.brass).map((s) => s.d).join('')} stroke="var(--brass)" strokeOpacity={0.22} />
        <path d={LINKS} stroke="var(--board-ink)" strokeOpacity={0.07} />
      </g>
    </svg>
  );
}
