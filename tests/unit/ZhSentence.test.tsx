import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ZhSentence } from '@/components/zh/ZhSentence';
import { ZhTextProvider, type PinyinMode } from '@/components/zh/ZhContext';
import { Pinyin } from '@/components/zh/Pinyin';
import { ProgressProvider } from '@/components/ProgressProvider';

const ZH = '书 在 桌子 [[上]] 。';
const PY = 'shū zài zhuōzi [[shang]] .';

const wrap = (ui: React.ReactNode, opts: { pinyin?: PinyinMode; toneColours?: boolean; recent?: string[]; words?: { zh: string; py: string; id: string }[] } = {}) =>
  render(
    <ProgressProvider>
      <ZhTextProvider pinyin={opts.pinyin ?? 'always'} toneColours={opts.toneColours ?? true} recentWords={opts.recent} words={opts.words}>
        {ui}
      </ZhTextProvider>
    </ProgressProvider>,
  );

const line = (c: HTMLElement) => c.querySelector('p[lang="zh-Hans"]')!;

describe('ZhSentence', () => {
  it('renders one ruby per word and one rt per character', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} id="Bukunya di atas meja." />);
    expect(container.querySelectorAll('ruby')).toHaveLength(4);
    expect(container.querySelectorAll('rt')).toHaveLength(5);
    const rubies = [...container.querySelectorAll('ruby')];
    expect(rubies[2].querySelectorAll('rt')).toHaveLength(2);
    expect([...rubies[2].querySelectorAll('rt')].map((r) => r.textContent!.normalize('NFC'))).toEqual(['zhuō', 'zi']);
  });

  it('shows hanzi without spaces, with lang attributes on Chinese, pinyin and Indonesian', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} id="Bukunya di atas meja." />);
    const p = line(container);
    const hanzi = [...p.querySelectorAll('ruby > span')].map((s) => s.textContent).join('');
    expect(hanzi).toBe('书在桌子上');
    for (const rt of container.querySelectorAll('rt')) expect(rt).toHaveAttribute('lang', 'zh-Latn-pinyin');
    expect(container.querySelector('p[lang="id"]')).toHaveTextContent('Bukunya di atas meja.');
    expect(container.querySelector('p[lang="id"]')).toHaveClass('id-text');
  });

  it('applies tone classes to the hanzi and its rt, per syllable', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />);
    const zhuo = [...container.querySelectorAll('ruby')][2];
    const [base, rt] = [zhuo.querySelector('span'), zhuo.querySelector('rt')];
    expect(base).toHaveClass('tone-1');
    expect(rt).toHaveClass('tone-1');
    expect(zhuo.querySelectorAll('rt')[1]).toHaveClass('tone-0');
  });

  it('drops tone classes when tone colours are off, and the focus takes the accent', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />, { toneColours: false });
    expect(container.querySelector('[class*="tone-"]')).toBeNull();
    const focus = container.querySelector('.zh-focus')!;
    expect(focus).not.toHaveClass('zh-focus-tones');
    expect(focus.textContent).toContain('上');
  });

  it('keeps a hidden rt in the layout (visibility, not display)', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />, { pinyin: 'on-request' });
    const rts = container.querySelectorAll('rt');
    expect(rts).toHaveLength(5);
    for (const rt of rts) expect(rt).toHaveClass('rt-hidden');
  });

  it('in "new" mode shows pinyin only over recent words', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />, { pinyin: 'new', recent: ['桌子'] });
    const rubies = [...container.querySelectorAll('ruby')];
    expect(rubies[2].querySelector('rt')).not.toHaveClass('rt-hidden');
    expect(rubies[0].querySelector('rt')).toHaveClass('rt-hidden');
  });

  it('reveals all pinyin while P is held', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />, { pinyin: 'on-request' });
    act(() => {
      fireEvent.keyDown(window, { key: 'p' });
    });
    expect(container.querySelector('rt.rt-hidden')).toBeNull();
    act(() => {
      fireEvent.keyUp(window, { key: 'p' });
    });
    expect(container.querySelectorAll('rt.rt-hidden')).toHaveLength(5);
  });

  it('gives screen readers the hanzi and then the pinyin in brackets, never interleaved', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />);
    for (const rt of container.querySelectorAll('rt')) expect(rt).toHaveAttribute('aria-hidden');
    const sr = container.querySelector('.sr-only[lang="zh-Latn-pinyin"]')!;
    expect(sr.textContent!.normalize('NFC')).toBe(' (shū zài zhuōzi shang.)');
  });

  it('withholds the pinyin from screen readers when it is hidden (reading items)', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} showPinyin={false} />);
    expect(container.querySelector('.sr-only[lang="zh-Latn-pinyin"]')).toBeNull();
  });

  it('lets words break only between words', () => {
    const { container } = wrap(<ZhSentence zh={ZH} py={PY} />);
    expect(line(container)).toHaveClass('zh-line');
    // A <wbr> before every word but the first, none before punctuation.
    expect(container.querySelectorAll('wbr')).toHaveLength(3);
  });

  it('opens the word sheet for a known word', () => {
    wrap(<ZhSentence zh={ZH} py={PY} />, { words: [{ zh: '桌子', py: 'zhuōzi', id: 'meja' }] });
    fireEvent.click(screen.getByRole('button', { name: /桌子/ }));
    const dialog = screen.getByRole('dialog', { name: '桌子' });
    expect(dialog).toHaveTextContent('meja');
  });

  it('marks the off side of a pair with strikethrough and no audio', () => {
    const { container } = wrap(<ZhSentence zh="在 上 桌子 。" py="zài shàng zhuōzi ." off />);
    expect(line(container)).toHaveClass('off-text');
    expect(container.querySelector('[data-play]')).toBeNull();
  });
});

describe('Pinyin', () => {
  it('is upright, lang-tagged, decomposed for the font, and tone-coloured per syllable', () => {
    const { container } = render(<Pinyin text="nǐhǎo" tones />);
    const p = container.querySelector('[lang="zh-Latn-pinyin"]')!;
    expect(p).toHaveClass('py');
    expect(p.textContent).toBe('nǐhǎo'.normalize('NFD'));
    expect(p.querySelectorAll('.tone-3')).toHaveLength(2);
  });
});
