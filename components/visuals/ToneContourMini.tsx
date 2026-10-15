import { contourPoints } from '@/lib/zh/contour';

type Props = {
  /** Tones per syllable (0 neutral). */
  tones: number[];
  width?: number;
  height?: number;
  /** Colour each syllable's line by its tone; otherwise --ink. */
  colours?: boolean;
  label?: string;
};

/**
 * ToneContour mini (DESIGN §8.1): the pitch line of a word or phrase, 160×60, syllables joined, on
 * three faint pitch guides. Decorative unless labelled.
 */
export function ToneContourMini({ tones, width = 160, height = 60, colours = true, label }: Props) {
  const pad = 6;
  const n = Math.max(tones.length, 1);
  const x = (t: number) => pad + (t / n) * (width - pad * 2);
  const y = (p: number) => pad + ((5 - p) / 4) * (height - pad * 2);
  const segs = contourPoints(tones);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="shrink-0"
    >
      {[1, 3, 5].map((p) => (
        <line key={p} x1={pad} x2={width - pad} y1={y(p)} y2={y(p)} style={{ stroke: 'var(--rule)', strokeWidth: 1 }} />
      ))}
      {segs.map((pts, i) => (
        <polyline
          key={i}
          points={pts.map(([t, p]) => `${x(t).toFixed(1)},${y(p).toFixed(1)}`).join(' ')}
          fill="none"
          style={{ stroke: colours ? `var(--tone-${tones[i]})` : 'var(--ink)', strokeWidth: tones[i] === 0 ? 5 : 3, strokeLinecap: 'round', strokeLinejoin: 'round' }}
        />
      ))}
    </svg>
  );
}
