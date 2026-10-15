// Tone contours on the five-level Chao pitch scale (1 low … 5 high), DESIGN §8.1.

/** Pitch targets over one syllable's duration: 55, 35, 214, 51; neutral is a short mid-low dot. */
export const CHAO: Record<number, number[]> = {
  1: [5, 5],
  2: [3, 5],
  3: [2, 1, 4],
  4: [5, 1],
  0: [2.5],
};

/** A third tone before another syllable is spoken as a low 21 ("half third"), not the full dip. */
export const HALF_THIRD = [2, 1];

/** Pitch points for a sequence of tones, each syllable one unit of time wide: [t, pitch][]. */
export function contourPoints(tones: number[]): [number, number][][] {
  return tones.map((t, i) => {
    const pts = t === 3 && i < tones.length - 1 ? HALF_THIRD : (CHAO[t] ?? CHAO[0]);
    if (pts.length === 1) return [[i + 0.45, pts[0]], [i + 0.55, pts[0]]];
    return pts.map((p, k) => [i + 0.1 + (0.8 * k) / (pts.length - 1), p] as [number, number]);
  });
}
