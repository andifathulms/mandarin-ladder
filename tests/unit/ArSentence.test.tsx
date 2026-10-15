import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ArSentence } from '@/components/ar/ArSentence';
import { LessonTextProvider } from '@/components/ar/LessonText';
import { ProgressProvider } from '@/components/ProgressProvider';
import { Prose } from '@/components/lesson/Prose';
import { displayPieces } from '@/lib/arabic/display';
import { ZWJ } from '@/lib/arabic';

const wrap = (ui: React.ReactNode, harakat: 'full' | 'partial' | 'none' = 'full', showTranslit = true) =>
  render(
    <ProgressProvider>
      <LessonTextProvider harakat={harakat} showTranslit={showTranslit}>
        {ui}
      </LessonTextProvider>
    </ProgressProvider>,
  );

const AR = 'الكُرَةُ [[تَحْتَ]] الطَّاوِلَةِ.';
const arText = (c: HTMLElement) => c.querySelector('p[lang="ar"]')!.textContent!.replace(new RegExp(ZWJ, 'g'), '');

describe('ArSentence', () => {
  it('renders Arabic in an RTL island, then transliteration, then Indonesian', () => {
    const { container } = wrap(<ArSentence ar={AR} tr="al-kuratu [[taḥta]] ṭ-ṭāwilati." id="Bolanya di bawah meja." />);
    const ar = container.querySelector('p[lang="ar"]')!;
    expect(ar).toHaveAttribute('dir', 'rtl');
    expect(arText(container)).toBe('الكُرَةُ تَحْتَ الطَّاوِلَةِ.');
    const tr = container.querySelector('p[lang="ar-Latn"]')!;
    expect(tr).toHaveClass('tr-text');
    expect(tr.className).not.toMatch(/italic/);
    expect(container.querySelector('.tr-focus')!.textContent).toBe('taḥta');
    expect(container.querySelector('p[lang="id"]')!.textContent).toBe('Bolanya di bawah meja.');
  });

  it('styles the focus with colour and underline only, never bold', () => {
    const { container } = wrap(<ArSentence ar={AR} />);
    const f = container.querySelector('.ar-focus')!;
    expect(f.textContent).toBe('تَحْتَ');
    expect(f.className).not.toMatch(/font-bold|font-semibold/);
  });

  it('keeps letters joined around a focus inside a word', () => {
    const { container } = wrap(<ArSentence ar="[[ال]]كِتَابُ جَدِيدٌ." />);
    const spans = [...container.querySelectorAll('p[lang="ar"] > *')].map((e) => e.textContent);
    expect(spans[0]).toBe(`ال${ZWJ}`);
    expect(spans[1]).toBe(`${ZWJ}كِتَابُ`);
  });

  it('hides transliteration when the lesson says so', () => {
    const { container } = wrap(<ArSentence ar={AR} tr="x" />, 'full', false);
    expect(container.querySelector('p[lang="ar-Latn"]')).toBeNull();
  });

  it('marks Egyptian lines with lang ar-EG and the EG chip', () => {
    const { container } = wrap(<ArSentence ar="إزَّيَّك؟" variety="eg" />);
    expect(container.querySelector('p[lang="ar-EG"]')).not.toBeNull();
    expect(screen.getByText('EG')).toBeInTheDocument();
  });
});

describe('harakat levels', () => {
  const src = 'الْمُدَرِّسُ [[فِي]] الْفَصْلِ.';
  it('full shows everything as authored', () => {
    const { container } = wrap(<ArSentence ar={src} />, 'full');
    expect(arText(container)).toBe('الْمُدَرِّسُ فِي الْفَصْلِ.');
  });
  it('partial keeps shaddah, tanwin and the focus word', () => {
    const { container } = wrap(<ArSentence ar={src} />, 'partial');
    expect(arText(container)).toBe('المدرّس فِي الفصل.');
  });
  it('none strips all marks', () => {
    const { container } = wrap(<ArSentence ar={src} />, 'none');
    expect(arText(container)).toBe('المدرس في الفصل.');
  });
  it('HoldReveal shows full harakat while pressed (350ms)', () => {
    vi.useFakeTimers();
    const { container } = wrap(<ArSentence ar={src} />, 'none');
    const hold = container.querySelector('[data-hold]')!;
    fireEvent.pointerDown(hold);
    act(() => vi.advanceTimersByTime(360));
    expect(arText(container)).toBe('الْمُدَرِّسُ فِي الْفَصْلِ.');
    fireEvent.pointerUp(hold);
    expect(arText(container)).toBe('المدرس في الفصل.');
    vi.useRealTimers();
  });
  it('holding H shows full harakat, releasing hides them', () => {
    const { container } = wrap(<ArSentence ar={src} />, 'none');
    fireEvent.keyDown(window, { key: 'h' });
    expect(arText(container)).toBe('الْمُدَرِّسُ فِي الْفَصْلِ.');
    fireEvent.keyUp(window, { key: 'h' });
    expect(arText(container)).toBe('المدرس في الفصل.');
  });
});

describe('displayPieces', () => {
  it('assigns spoken-word indexes and leaves spaces out', () => {
    const p = displayPieces('هٰذَا [[كِتَابٌ]] جَدِيدٌ.');
    expect(p.filter((x) => x.word >= 0).map((x) => x.word)).toEqual([0, 1, 2]);
  });
});

describe('Prose', () => {
  it('wraps bare Arabic in an island and keeps Latin terms bold', () => {
    const { container } = render(<Prose lang="id" text={'Kata **kitab** berasal dari كِتَابٌ, dan **بَيْتٌ** artinya rumah.'} />);
    const islands = container.querySelectorAll('bdi[lang="ar"]');
    expect([...islands].map((i) => i.textContent)).toEqual(['كِتَابٌ', 'بَيْتٌ']);
    expect(container.querySelector('strong')!.textContent).toBe('kitab');
    // Arabic **term**: accent colour, not bold
    expect(islands[1].className).toMatch(/text-accent/);
    expect(islands[1].closest('strong')).toBeNull();
  });
});
