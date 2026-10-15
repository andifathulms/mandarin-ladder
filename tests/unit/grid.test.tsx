import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Grid, gridPaths } from '@/components/ui/Grid';

describe('Grid (board pattern)', () => {
  it('is deterministic', () => {
    expect(gridPaths()).toEqual(gridPaths());
  });
  it('draws every square with a cross, some with diagonals, a few in brass', () => {
    const p = gridPaths();
    const squares = (p.cells.match(/Z/g) ?? []).length + (p.brass.match(/Z/g) ?? []).length;
    expect(squares).toBe(15 * 8);
    expect((p.brass.match(/Z/g) ?? []).length).toBeGreaterThan(5);
    expect((p.diagonals.match(/M/g) ?? []).length).toBeGreaterThan(0);
  });
  it('is hidden from assistive technology and fades toward the start', () => {
    const { container } = render(<Grid />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden');
    expect(svg.querySelector('mask')).not.toBeNull();
    expect(svg.querySelector('[stroke-dasharray="3 3"]')).not.toBeNull();
  });
});
