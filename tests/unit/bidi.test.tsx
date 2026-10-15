import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ArIsland } from '@/components/ar/ArIsland';
import { useRoving } from '@/components/visuals/useRoving';
import { findPhysical, lintPhysical } from '@/scripts/lint-physical';

describe('ArIsland', () => {
  it('renders an inline bdi with lang and dir', () => {
    const { container } = render(<p>Kata <ArIsland>كِتَابٌ</ArIsland> artinya buku.</p>);
    const bdi = container.querySelector('bdi')!;
    expect(bdi).toHaveAttribute('lang', 'ar');
    expect(bdi).toHaveAttribute('dir', 'rtl');
    expect(bdi).toHaveClass('ar', 'font-ar');
  });
  it('renders blocks, faces, sizes and Egyptian', () => {
    const { container } = render(
      <ArIsland block size="glyph" face="display" variety="eg">
        بَ
      </ArIsland>,
    );
    const div = container.querySelector('div')!;
    expect(div).toHaveAttribute('lang', 'ar-EG');
    expect(div).toHaveClass('font-ar-display', 'text-ar-glyph');
  });
});

function Group({ dir, onChange }: { dir: 'ltr' | 'rtl'; onChange: (v: string) => void }) {
  const opts = ['a', 'b', 'c'];
  const r = useRoving(opts, 'b', onChange, dir);
  return (
    <div role="radiogroup" onKeyDown={r.onKeyDown}>
      {opts.map((o, i) => (
        <button key={o} type="button" {...r.itemProps(o, i)}>
          {o}
        </button>
      ))}
    </div>
  );
}

describe('useRoving', () => {
  it('moves forward with ArrowRight in LTR', () => {
    const fn = vi.fn();
    render(<Group dir="ltr" onChange={fn} />);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
    expect(fn).toHaveBeenCalledWith('c');
  });
  it('follows visual direction in RTL: Left is the next item', () => {
    const fn = vi.fn();
    render(<Group dir="rtl" onChange={fn} />);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(fn).toHaveBeenCalledWith('c');
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
    expect(fn).toHaveBeenLastCalledWith('a');
  });
});

describe('physical CSS lint', () => {
  it('flags physical utilities and inline styles, with variants', () => {
    const src = `<div className="pl-3 min-[900px]:mr-2 text-left border-r -left-[4px]" style={{ left: 3 }} />`;
    expect(findPhysical(src).map((f) => f.match)).toEqual(['pl-3', 'mr-2', 'text-left', 'border-r', '-left-[4px]', 'left:']);
  });
  it('allows logical utilities, words in comments and unrelated code', () => {
    const src = `// right-to-left is fine here\n<div className="ps-3 me-2 text-start border-s start-0" onKeyDown={() => e.key === 'ArrowLeft'} />`;
    expect(findPhysical(src)).toEqual([]);
  });
  it('finds nothing in the Arabic-bearing components', () => {
    expect(lintPhysical()).toEqual([]);
  });
});
