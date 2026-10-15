import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  classifyStroke,
  judgeStroke,
  matchStroke,
  resample,
  showHint,
  startTrace,
  totalMisses,
  toScreen,
  traceStep,
  TRACE_CONFIG,
  type Point,
} from '@/lib/zh/trace';

type Fixture = { char: string; medians: Point[][]; samples: { label: string; strokes: Point[][]; misses: number; firstMiss?: 'order' | 'shape' }[] };

const DIR = path.join(process.cwd(), 'tests', 'fixtures', 'traces');
const fixtures: Fixture[] = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')));

const run = (fx: Fixture, strokes: Point[][]) => {
  let s = startTrace(fx.medians.length);
  const judged = [];
  for (const d of strokes) {
    const r = traceStep(s, d, fx.medians);
    s = r.state;
    judged.push(r.judgement);
  }
  return { s, judged };
};

describe('trace fixtures', () => {
  it('cover 30 characters', () => {
    expect(fixtures.length).toBe(30);
  });
  for (const fx of fixtures) {
    describe(fx.char, () => {
      for (const sample of fx.samples) {
        it(`${sample.label}: ${sample.misses} miss(es), finished`, () => {
          const { s, judged } = run(fx, sample.strokes);
          expect(s.done).toBe(true);
          expect(totalMisses(s)).toBe(sample.misses);
          expect(totalMisses(s) <= TRACE_CONFIG.passMisses).toBe(true);
          if (sample.firstMiss) expect(judged[0]).toMatchObject({ result: 'miss', why: sample.firstMiss });
        });
      }
    });
  }
});

describe('matcher', () => {
  const heng: Point[] = [
    [200, 450],
    [800, 450],
  ];
  it('passes a stroke drawn along the median', () => {
    expect(matchStroke(resample(heng.map(toScreen), 10), heng).ok).toBe(true);
  });
  it('fails a reversed stroke on its start', () => {
    expect(matchStroke(resample(heng.map(toScreen), 10).reverse(), heng)).toMatchObject({ ok: false, reason: 'start' });
  });
  it('fails a far-away stroke', () => {
    const away = heng.map(([x, y]) => [x, y - 400] as Point);
    expect(matchStroke(resample(away.map(toScreen), 10), heng).ok).toBe(false);
  });
  it('fails a stroke far too short', () => {
    const short: Point[] = [toScreen([200, 450]), toScreen([260, 450])];
    expect(matchStroke(short, heng).ok).toBe(false);
  });
  it('treats a later stroke as wrong order', () => {
    const shu: Point[] = [
      [500, 800],
      [500, 100],
    ];
    expect(judgeStroke(resample(shu.map(toScreen), 10), [heng, shu], 0)).toMatchObject({ result: 'miss', why: 'order' });
  });
  it('shows the hint after two misses on a stroke', () => {
    let s = startTrace(1);
    const bad: Point[] = [
      [0, 0],
      [10, 900],
    ];
    s = traceStep(s, bad, [heng]).state;
    expect(showHint(s)).toBe(false);
    s = traceStep(s, bad, [heng]).state;
    expect(showHint(s)).toBe(true);
  });
});

describe('stroke names', () => {
  const byChar = Object.fromEntries(fixtures.map((f) => [f.char, f.medians]));
  it('names simple strokes', () => {
    expect(classifyStroke(byChar['一'][0])).toBe('heng');
    expect(classifyStroke(byChar['上'][0])).toBe('shu');
    expect(classifyStroke(byChar['人'][0])).toBe('pie');
    expect(classifyStroke(byChar['人'][1])).toBe('na');
    expect(classifyStroke(byChar['中'][3])).toBe('shu');
  });
  it('finds turns and hooks', () => {
    expect(['zhe', 'gou']).toContain(classifyStroke(byChar['口'][1]));
    expect(classifyStroke(byChar['小'][0])).toBe('gou');
  });
});
