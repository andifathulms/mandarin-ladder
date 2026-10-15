import { useId } from 'react';

/**
 * The board pattern (DESIGN §9): a 田字格 practice grid of 48px squares, each with a dashed cross;
 * every fourth square also gets the 米字格 diagonals, and every eighth is outlined in brass. It fades
 * out toward the inline-start edge so text on the board always sits on plain red. Generated in code:
 * no hand-written path data, no randomness.
 */
const CELL = 48;
const W = 720;
const H = 384;

export type GridParts = { cells: string; crosses: string; diagonals: string; brass: string };

export function gridPaths(): GridParts {
  const cells: string[] = [];
  const crosses: string[] = [];
  const diagonals: string[] = [];
  const brass: string[] = [];
  let i = 0;
  for (let y = 0; y < H; y += CELL) {
    for (let x = 0; x < W; x += CELL) {
      const sq = `M${x},${y}h${CELL}v${CELL}h-${CELL}Z`;
      if (i % 8 === 7) brass.push(sq);
      else cells.push(sq);
      const h = CELL / 2;
      crosses.push(`M${x},${y + h}h${CELL}M${x + h},${y}v${CELL}`);
      if (i % 4 === 3) diagonals.push(`M${x},${y}l${CELL},${CELL}M${x + CELL},${y}l-${CELL},${CELL}`);
      i++;
    }
    // Offset the counting per row so the accents don't line up in columns.
    i += 3;
  }
  return { cells: cells.join(''), crosses: crosses.join(''), diagonals: diagonals.join(''), brass: brass.join('') };
}

const P = gridPaths();

export function Grid({ className = '' }: { className?: string }) {
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
        <linearGradient id={`gf-${id}`} x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`gm-${id}`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#gf-${id})`} />
        </mask>
      </defs>
      <g mask={`url(#gm-${id})`} fill="none" strokeWidth={1}>
        <path d={P.cells} stroke="var(--board-ink)" strokeOpacity={0.07} />
        <path d={P.crosses} stroke="var(--board-ink)" strokeOpacity={0.07} strokeDasharray="3 3" />
        <path d={P.diagonals} stroke="var(--board-ink)" strokeOpacity={0.07} strokeDasharray="3 3" />
        <path d={P.brass} stroke="var(--brass)" strokeOpacity={0.22} />
      </g>
    </svg>
  );
}
