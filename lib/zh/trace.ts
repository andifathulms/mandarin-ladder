// Stroke geometry and the tracing matcher (CLAUDE.md §7.5). Pure: no DOM.
// Coordinates: Make Me a Hanzi's 1024 grid with y up; toScreen() flips to y down (y' = 900 − y),
// which is the space drawings are made in.

export type Point = [number, number];
export type StrokeData = { strokes: string[]; medians: Point[][] };

export const GRID = 1024;

/** Every threshold in one place; tuned by the fixture traces in tests/fixtures/traces/. */
export const TRACE_CONFIG = {
  samples: 32,
  /** Start and end within this fraction of the grid. */
  endpoint: 0.18,
  /** Cosine similarity of the overall vectors. */
  direction: 0.6,
  /** Mean point distance as a fraction of the grid; looser for hooks and turns. */
  shape: 0.12,
  shapeTurn: 0.2,
  /** Drawn length / expected length. */
  lengthMin: 0.5,
  lengthMax: 1.6,
  /** Misses on one stroke before its path is shown. */
  hintAfter: 2,
  /** Total misses for a character to count as correct. */
  passMisses: 2,
} as const;

export const toScreen = ([x, y]: Point): Point => [x, 900 - y];

const dist = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export function length(pts: Point[]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++) n += dist(pts[i - 1], pts[i]);
  return n;
}

/** Resamples a polyline to n points evenly spaced along its length. */
export function resample(pts: Point[], n: number = TRACE_CONFIG.samples): Point[] {
  if (pts.length === 0) return [];
  if (pts.length === 1) return Array.from({ length: n }, () => [...pts[0]] as Point);
  const total = length(pts);
  if (total === 0) return Array.from({ length: n }, () => [...pts[0]] as Point);
  const step = total / (n - 1);
  const out: Point[] = [[...pts[0]] as Point];
  let acc = 0;
  let i = 1;
  let prev = pts[0];
  while (out.length < n - 1 && i < pts.length) {
    const d = dist(prev, pts[i]);
    if (acc + d >= step) {
      const t = (step - acc) / d;
      const p: Point = [prev[0] + t * (pts[i][0] - prev[0]), prev[1] + t * (pts[i][1] - prev[1])];
      out.push(p);
      prev = p;
      acc = 0;
    } else {
      acc += d;
      prev = pts[i];
      i += 1;
    }
  }
  while (out.length < n) out.push([...pts[pts.length - 1]] as Point);
  return out;
}

/** A 3-point moving average, keeping the end points. */
export function smooth(pts: Point[]): Point[] {
  return pts.map((p, i) => {
    if (i === 0 || i === pts.length - 1) return p;
    return [(pts[i - 1][0] + p[0] + pts[i + 1][0]) / 3, (pts[i - 1][1] + p[1] + pts[i + 1][1]) / 3] as Point;
  });
}

/** Turning angles (degrees) along a resampled polyline. */
function turns(pts: Point[]): number[] {
  const out: number[] = [];
  for (let i = 2; i < pts.length; i++) {
    const a = Math.atan2(pts[i - 1][1] - pts[i - 2][1], pts[i - 1][0] - pts[i - 2][0]);
    const b = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]);
    let d = Math.abs(((b - a) * 180) / Math.PI);
    if (d > 180) d = 360 - d;
    out.push(d);
  }
  return out;
}

/** True when a median has a sharp turn somewhere (a hook or a turning stroke). */
export function isHookOrTurn(median: Point[]): boolean {
  const r = resample(median.map(toScreen), 16);
  // Accumulate turning over a short window so a corner split across samples still counts.
  const t = turns(r);
  for (let i = 0; i < t.length; i++) if (t[i] + (t[i + 1] ?? 0) > 60) return true;
  return false;
}

export type StrokeName = 'heng' | 'shu' | 'pie' | 'dian' | 'na' | 'ti' | 'zhe' | 'gou';

/** The eight basic strokes (DESIGN §8.5): 横 竖 撇 点 捺 提 折 钩. */
export const STROKE_NAMES: Record<StrokeName, { zh: string; py: string; id: string; en: string }> = {
  heng: { zh: '横', py: 'héng', id: 'mendatar', en: 'horizontal' },
  shu: { zh: '竖', py: 'shù', id: 'tegak', en: 'vertical' },
  pie: { zh: '撇', py: 'piě', id: 'sapuan kiri', en: 'left-falling' },
  dian: { zh: '点', py: 'diǎn', id: 'titik', en: 'dot' },
  na: { zh: '捺', py: 'nà', id: 'sapuan kanan', en: 'right-falling' },
  ti: { zh: '提', py: 'tí', id: 'naik', en: 'rising' },
  zhe: { zh: '折', py: 'zhé', id: 'belok', en: 'turning' },
  gou: { zh: '钩', py: 'gōu', id: 'kait', en: 'hook' },
};

/**
 * Names a stroke from its median. The stroke data carries no types, so this is a heuristic: a sharp
 * turn makes it 折, or 钩 in the last 30%; otherwise direction and length decide. Characters that
 * lessons teach stroke by stroke get authored names (content/data/stroke-names.yaml), which win.
 */
export function classifyStroke(median: Point[]): StrokeName {
  const pts = resample(median.map(toScreen), 20);
  const t = turns(pts);
  const [x0, y0] = pts[0];
  const [x1, y1] = pts[pts.length - 1];
  const dx = x1 - x0;
  const dy = y1 - y0; // screen space: down is positive
  const len = Math.hypot(dx, dy);
  // The pen's entry (the first 15%) often curls; it is not a turn. A turn in the last 30% is a hook.
  const skip = Math.ceil(t.length * 0.15);
  const sharp = t.findIndex((a, i) => i >= skip && a + (t[i + 1] ?? 0) + (t[i + 2] ?? 0) > 65);
  if (sharp >= 0) return sharp >= t.length * 0.7 ? 'gou' : 'zhe';
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 right, 90 down
  if (len < GRID * 0.08) return 'dian';
  if (ang > -12 && ang < 15) return 'heng';
  if (len < GRID * 0.18 && !(ang >= 68 && ang <= 112)) return 'dian';
  // Direction of the last third: a vertical that sweeps left at the end is a 撇.
  const k = Math.floor(pts.length * 0.66);
  const endAng = (Math.atan2(y1 - pts[k][1], x1 - pts[k][0]) * 180) / Math.PI;
  if (ang > -12 && ang < 15) return 'heng';
  if (ang <= -12 && ang > -85) return 'ti';
  if (ang >= 15 && ang < 68) return len < GRID * 0.26 ? 'dian' : 'na';
  if (ang >= 68 && ang <= 112) return endAng > 125 ? 'pie' : 'shu';
  if (ang > 112) return 'pie';
  return 'heng';
}

export type StrokeMatch = { ok: boolean; reason?: 'start' | 'end' | 'direction' | 'shape' | 'length' };

/** Compares a drawn stroke (screen space, grid units) with an expected median (data space). */
export function matchStroke(drawn: Point[], median: Point[], cfg = TRACE_CONFIG): StrokeMatch {
  if (drawn.length < 2) return { ok: false, reason: 'length' };
  const exp = resample(median.map(toScreen), cfg.samples);
  const got = resample(drawn, cfg.samples);
  if (dist(got[0], exp[0]) > cfg.endpoint * GRID) return { ok: false, reason: 'start' };
  if (dist(got[got.length - 1], exp[exp.length - 1]) > cfg.endpoint * GRID) return { ok: false, reason: 'end' };
  const v1: Point = [got[got.length - 1][0] - got[0][0], got[got.length - 1][1] - got[0][1]];
  const v2: Point = [exp[exp.length - 1][0] - exp[0][0], exp[exp.length - 1][1] - exp[0][1]];
  const n1 = Math.hypot(...v1);
  const n2 = Math.hypot(...v2);
  if (n1 > 0 && n2 > 0) {
    const cos = (v1[0] * v2[0] + v1[1] * v2[1]) / (n1 * n2);
    if (cos < cfg.direction) return { ok: false, reason: 'direction' };
  }
  const mean = got.reduce((s, p, i) => s + dist(p, exp[i]), 0) / got.length;
  const limit = (isHookOrTurn(median) ? cfg.shapeTurn : cfg.shape) * GRID;
  if (mean > limit) return { ok: false, reason: 'shape' };
  // Length on a lightly smoothed path, so pointer jitter doesn't count as length.
  const ratio = length(smooth(got)) / Math.max(1, length(exp));
  if (ratio < cfg.lengthMin || ratio > cfg.lengthMax) return { ok: false, reason: 'length' };
  return { ok: true };
}

export type Judgement = { result: 'pass' } | { result: 'miss'; why: 'order' | 'shape'; detail?: StrokeMatch['reason'] };

/**
 * Judges a drawn stroke when stroke k is expected. A stroke that matches a later stroke instead is a
 * miss for wrong order, not a pass (CLAUDE.md §7.5).
 */
export function judgeStroke(drawn: Point[], medians: Point[][], k: number): Judgement {
  const m = matchStroke(drawn, medians[k]);
  if (m.ok) return { result: 'pass' };
  for (let j = k + 1; j < medians.length; j++) if (matchStroke(drawn, medians[j]).ok) return { result: 'miss', why: 'order' };
  return { result: 'miss', why: 'shape', detail: m.reason };
}

/** A tracing attempt: the expected stroke, misses per stroke, and whether to show the hint. */
export type TraceState = { k: number; misses: number[]; done: boolean };

export const startTrace = (n: number): TraceState => ({ k: 0, misses: Array(n).fill(0), done: n === 0 });

export function traceStep(s: TraceState, drawn: Point[], medians: Point[][]): { state: TraceState; judgement: Judgement } {
  if (s.done) return { state: s, judgement: { result: 'pass' } };
  const j = judgeStroke(drawn, medians, s.k);
  if (j.result === 'pass') {
    const k = s.k + 1;
    return { state: { ...s, k, done: k >= medians.length }, judgement: j };
  }
  const misses = s.misses.map((m, i) => (i === s.k ? m + 1 : m));
  return { state: { ...s, misses }, judgement: j };
}

export const totalMisses = (s: TraceState) => s.misses.reduce((a, b) => a + b, 0);
export const showHint = (s: TraceState) => !s.done && s.misses[s.k] >= TRACE_CONFIG.hintAfter;

/** A median as an SVG path in screen space. */
export function medianPath(median: Point[]): string {
  return median.map(toScreen).map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
}
