import { beforeAll, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TracePad } from '@/components/zh/TracePad';
import { StrokeOrder } from '@/components/visuals/StrokeOrder';
import { TraceCheck } from '@/components/check/TraceCheck';
import { __setStrokes } from '@/components/zh/useStrokes';
import { ProgressProvider } from '@/components/ProgressProvider';
import type { StrokeData } from '@/lib/zh/trace';

// 十: a horizontal, then a vertical (data space: y up, 900 at the top).
const SHI: StrokeData = {
  strokes: ['M 100 400 L 900 400 L 900 360 L 100 360 Z', 'M 480 820 L 520 820 L 520 -60 L 480 -60 Z'],
  medians: [
    [
      [120, 380],
      [880, 380],
    ],
    [
      [500, 800],
      [500, -40],
    ],
  ],
};

beforeAll(() => {
  // jsdom has no PointerEvent; a MouseEvent with a pointerId is enough for these handlers.
  if (!('PointerEvent' in window)) {
    class PE extends MouseEvent {
      pointerId: number;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
      }
    }
    (window as unknown as { PointerEvent: typeof PE }).PointerEvent = PE;
  }
  __setStrokes('十', SHI);
});

const wrap = (ui: React.ReactNode) => render(<ProgressProvider>{ui}</ProgressProvider>);

/** Draws a stroke on the pad in grid units (screen space, y down). */
function stroke(pad: Element, pts: [number, number][]) {
  const [first, ...rest] = pts;
  fireEvent.pointerDown(pad, { clientX: first[0], clientY: first[1], pointerId: 7 });
  for (const [x, y] of rest) fireEvent.pointerMove(pad, { clientX: x, clientY: y, pointerId: 7 });
  const last = pts[pts.length - 1];
  fireEvent.pointerUp(pad, { clientX: last[0], clientY: last[1], pointerId: 7 });
}

const line = (a: [number, number], b: [number, number], n = 12): [number, number][] =>
  Array.from({ length: n }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / (n - 1), a[1] + ((b[1] - a[1]) * i) / (n - 1)]);

function pad(container: HTMLElement) {
  const el = container.querySelector('[data-trace-pad]')!;
  // A 1024px pad, so client coordinates are grid units.
  el.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1024, height: 1024, right: 1024, bottom: 1024, x: 0, y: 0, toJSON: () => ({}) });
  return el;
}

describe('TracePad', () => {
  it('accepts strokes drawn in order and reports no misses', () => {
    const onDone = vi.fn();
    const { container } = wrap(<TracePad data={SHI} onDone={onDone} />);
    const el = pad(container);
    // Screen space: y' = 900 − y.
    act(() => stroke(el, line([120, 520], [880, 520])));
    act(() => stroke(el, line([500, 100], [500, 940])));
    expect(onDone).toHaveBeenCalledWith(0);
  });

  it('counts a stroke in the wrong order as a miss and says so', () => {
    const onDone = vi.fn();
    const { container } = wrap(<TracePad data={SHI} onDone={onDone} />);
    const el = pad(container);
    act(() => stroke(el, line([500, 100], [500, 940])));
    expect(screen.getByText('Itu goresan yang nanti. Ikuti urutannya.')).toBeInTheDocument();
    act(() => stroke(el, line([120, 520], [880, 520])));
    act(() => stroke(el, line([500, 100], [500, 940])));
    expect(onDone).toHaveBeenCalledWith(1);
  });

  it('shows the expected stroke after two misses', () => {
    const { container } = wrap(<TracePad data={SHI} onDone={() => {}} />);
    const el = pad(container);
    act(() => stroke(el, line([880, 520], [120, 520])));
    expect(container.querySelector('[data-hint]')).toBeNull();
    act(() => stroke(el, line([880, 520], [120, 520])));
    expect(container.querySelector('[data-hint]')).not.toBeNull();
  });

  it('turns off touch scrolling on the pad', () => {
    const { container } = wrap(<TracePad data={SHI} onDone={() => {}} />);
    expect((pad(container) as SVGElement).style.touchAction).toBe('none');
  });
});

describe('TraceCheck keyboard alternative', () => {
  it('asks for the next stroke by name and finishes with the misses', async () => {
    const onDone = vi.fn();
    const { container } = wrap(<TraceCheck item={{ id: 't', type: 'trace', char: '十', guide: 'on', why: { id: 'x', en: 'x' } }} onDone={onDone} />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: 'Pakai keyboard' }));
    await act(async () => {});
    fireEvent.click(container.querySelector('[data-stroke-option="heng"]')!);
    fireEvent.click(container.querySelector('[data-stroke-option="pie"]') ?? container.querySelector('[data-stroke-option]:not([data-stroke-option="shu"])')!);
    fireEvent.click(container.querySelector('[data-stroke-option="shu"]')!);
    expect(onDone).toHaveBeenCalledWith(1);
  });
});

describe('StrokeOrder', () => {
  it('lists the stroke names and steps through them', async () => {
    const { container } = wrap(<StrokeOrder char="十" size={240} />);
    await act(async () => {});
    expect(screen.getByRole('img', { name: '十: 2 goresan' })).toBeInTheDocument();
    const items = container.querySelectorAll('ol li');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('横');
    expect(items[1]).toHaveTextContent('竖');
    fireEvent.click(screen.getByRole('button', { name: 'Goresan berikutnya' }));
    expect(container.querySelectorAll('svg text')).toHaveLength(1);
  });
});
