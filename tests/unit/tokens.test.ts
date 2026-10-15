import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// DESIGN §3.3 and §12: contrast targets, checked over styles/tokens.css in both themes.
const css = fs.readFileSync(path.join(process.cwd(), 'styles/tokens.css'), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

const light = block(':root {');
const dark = block(":root[data-theme='dark']");
const darkMedia = block(":root:not([data-theme='light'])");

function lum(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe.each([
  ['light', light],
  ['dark', dark],
])('tokens (%s)', (_name, t) => {
  it.each(['ink', 'muted', 'accent', 'good', 'off'])('%s reaches 4.5:1 on paper and surface', (fg) => {
    expect(contrast(t[fg], t.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t[fg], t.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it.each([
    ['accent', 'accent-soft'],
    ['good', 'good-bg'],
    ['off', 'off-bg'],
    ['eg', 'eg-soft'],
    ['huruf', 'huruf-soft'],
  ])('%s reaches 4.5:1 on %s', (fg, bg) => {
    expect(contrast(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
  });
  it('board-ink reaches 7:1 on board, brass 3:1', () => {
    expect(contrast(t['board-ink'], t.board)).toBeGreaterThanOrEqual(7);
    expect(contrast(t.brass, t.board)).toBeGreaterThanOrEqual(3);
  });
  it('harakat marks reach 3:1 on surface and paper-2', () => {
    expect(contrast(t.harakat, t.surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.harakat, t['paper-2'])).toBeGreaterThanOrEqual(3);
  });
  it('keeps the brand emerald and the correct-answer green apart', () => {
    // Different hues (DESIGN §3.3): accent leans blue, good leans yellow.
    expect(t.accent).not.toBe(t.good);
  });
});

describe('dark theme definitions', () => {
  it('are identical for the media query and the explicit attribute', () => {
    expect(darkMedia).toEqual(dark);
  });
  it('define every light colour token', () => {
    // Colour tokens are the ones whose light value is a hex colour (plus the shadow tint).
    const colours = Object.keys(light).filter((k) => light[k].startsWith('#') || k === 'shadow-rgb');
    expect(colours.length).toBeGreaterThan(35);
    for (const k of colours) expect(dark[k], k).toBeDefined();
  });
});
