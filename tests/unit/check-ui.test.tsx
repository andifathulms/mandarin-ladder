import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { OptionPill } from '@/components/check/OptionPill';
import { CheckItemView } from '@/components/check/CheckItemView';
import { ProgressProvider } from '@/components/ProgressProvider';
import { BottomActionBar } from '@/components/lesson/BottomActionBar';
import { ZhTextProvider } from '@/components/zh/ZhContext';
import type { CheckItem } from '@/lib/types';

const wrap = (ui: React.ReactNode) =>
  render(
    <ProgressProvider>
      <ZhTextProvider pinyin="always">{ui}</ZhTextProvider>
    </ProgressProvider>,
  );
const why = { id: 'Di atas: 上 (shàng), sesudah bendanya.', en: 'On top: 上, after the thing.' };
const item: CheckItem = {
  id: 'x1',
  type: 'gap',
  cue: 'Bukunya di atas meja.',
  prompt: '书 在 桌子 ___ 。',
  options: ['上', '下', '里'],
  answer: '上',
  why,
  py: { '书 在 桌子 ___ 。': 'shū zài zhuōzi ___ .', 上: 'shàng', 下: 'xià', 里: 'lǐ' },
};
const opt = (c: HTMLElement, label: string) => c.querySelector<HTMLButtonElement>(`[data-option="${label}"]`)!;

describe('OptionPill', () => {
  it.each(['idle', 'correct', 'wrong', 'selected'] as const)('renders %s with the hanzi in lang="zh-Hans" and ruby pinyin', (state) => {
    const { container } = wrap(<OptionPill label="上" py={{ 上: 'shàng' }} state={state} index={0} onClick={() => {}} badge />);
    const b = opt(container, '上');
    expect(b).toHaveAttribute('data-state', state);
    expect(b.querySelector('[lang="zh-Hans"]')).not.toBeNull();
    expect(b.querySelector('rt')!.textContent!.normalize('NFC')).toBe('shàng');
  });
  it('marks Indonesian options as id and strikes wrong ones', () => {
    const { container } = wrap(<OptionPill label="meja" state="wrong" index={0} onClick={() => {}} />);
    expect(opt(container, 'meja')).toHaveAttribute('lang', 'id');
    expect(opt(container, 'meja').querySelector('.line-through')).not.toBeNull();
  });
  it('hides the ruby when the item hides pinyin (reading items)', () => {
    const { container } = wrap(<OptionPill label="上" py={{ 上: 'shàng' }} showPinyin={false} state="idle" index={0} onClick={() => {}} />);
    expect(opt(container, '上').querySelector('rt')).toHaveClass('rt-hidden');
  });
});

describe('CheckItemView (practice)', () => {
  it('keeps the item open on a wrong answer, then solves with firstTry=false', () => {
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={item} onSolved={onSolved} />);
    fireEvent.click(opt(container, '下'));
    expect(screen.getByText('Belum tepat, coba lagi.')).toBeInTheDocument();
    expect(opt(container, '下')).toBeDisabled();
    expect(onSolved).not.toHaveBeenCalled();
    fireEvent.click(opt(container, '上'));
    expect(onSolved).toHaveBeenCalledWith(false);
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });

  it('fills the gap with the answer when solved', () => {
    const { container } = wrap(<CheckItemView mode="practice" item={item} onSolved={() => {}} />);
    fireEvent.click(opt(container, '上'));
    expect(container.querySelector('.zh-focus')!.textContent).toContain('上');
  });

  it('shows the why line as a hint after two misses', () => {
    const { container } = wrap(<CheckItemView mode="practice" item={item} onSolved={() => {}} />);
    fireEvent.click(opt(container, '下'));
    expect(screen.queryByText('Petunjuk:')).toBeNull();
    fireEvent.click(opt(container, '里'));
    expect(screen.getByText('Petunjuk:')).toBeInTheDocument();
  });

  it('answers with number keys 1–4', () => {
    const onSolved = vi.fn();
    wrap(<CheckItemView mode="practice" item={item} onSolved={onSolved} />);
    act(() => {
      fireEvent.keyDown(window, { key: '1' });
    });
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('shows a listen item as text without pinyin when nothing can play it', () => {
    const listen: CheckItem = { id: 'l', type: 'listen', audio: '我 很 忙 。', options: ['Aku sibuk.', 'Aku lapar.'], answer: 'Aku sibuk.', why, py: { '我 很 忙 。': 'wǒ hěn máng .' } };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={listen} onSolved={onSolved} />);
    expect(screen.getByText(/Tidak ada rekaman atau suara bahasa Mandarin/)).toBeInTheDocument();
    for (const rt of container.querySelectorAll('rt')) expect(rt).toHaveClass('rt-hidden');
    fireEvent.click(opt(container, 'Aku sibuk.'));
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('builds an order item from word tiles and shows the joined sentence', () => {
    const order: CheckItem = { id: 'o', type: 'order', tiles: ['北京', '我', '去', '明天'], answer: ['我', '明天', '去', '北京'], why, py: { 北京: 'Běijīng', 我: 'wǒ', 去: 'qù', 明天: 'míngtiān' } };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={order} onSolved={onSolved} />);
    for (const w of ['我', '明天', '去', '北京']) fireEvent.click(container.querySelector(`[data-tile="${w}"]`)!);
    expect(screen.getByText('我明天去北京')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('shows tone options as contours with numbers and grades the sequence', () => {
    const tone: CheckItem = { id: 't', type: 'tone', audio: '你好', audio_py: 'nǐhǎo', ask: 'spoken', options: [[3, 3], [2, 3], [2, 2]], answer: [2, 3], why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={tone} onSolved={onSolved} />);
    const opts = container.querySelectorAll('[data-tones]');
    expect(opts).toHaveLength(3);
    expect(opts[0].querySelector('svg')).not.toBeNull();
    expect(opts[0]).toHaveTextContent('3 + 3');
    fireEvent.click(container.querySelector('[data-tones="3,3"]')!);
    expect(onSolved).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('[data-tones="2,3"]')!);
    expect(onSolved).toHaveBeenCalledWith(false);
  });

  it('converts tone numbers live in the pinyin input and grades on Enter', () => {
    const p: CheckItem = { id: 'p', type: 'pinyin', audio: '你好', answer: 'nǐhǎo', why, py: { 你好: 'nǐhǎo' } };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={p} onSolved={onSolved} />);
    const input = container.querySelector<HTMLInputElement>('[data-pinyin-input]')!;
    fireEvent.change(input, { target: { value: 'ni3 hao3' } });
    expect(container.querySelector('[data-pinyin-preview]')!.textContent!.normalize('NFC')).toBe('nǐ hǎo');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('inserts tone numbers and ü from the helper keys', () => {
    const p: CheckItem = { id: 'p2', type: 'pinyin', audio: 'syl-lv4', answer: 'lǜ', why };
    const { container } = wrap(<CheckItemView mode="practice" item={p} onSolved={() => {}} />);
    const input = container.querySelector<HTMLInputElement>('[data-pinyin-input]')!;
    fireEvent.change(input, { target: { value: 'l' } });
    fireEvent.click(screen.getByRole('button', { name: 'ü' }));
    fireEvent.click(screen.getByRole('button', { name: 'nada 4' }));
    expect(input.value).toBe('lü4');
  });

  it('assembles a build item from component tiles', () => {
    const b: CheckItem = { id: 'b', type: 'build', char: '好', parts: ['女', '马', '子', '口'], answer: ['女', '子'], why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={b} onSolved={onSolved} />);
    fireEvent.click(container.querySelector('[data-part="女"]')!);
    fireEvent.click(container.querySelector('[data-part="子"]')!);
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(onSolved).toHaveBeenCalledWith(true);
    expect(screen.getByText('好')).toBeInTheDocument();
  });
});

describe('CheckItemView (test mode)', () => {
  it('reports the choice without grading or feedback', () => {
    const onChange = vi.fn();
    const { container } = wrap(<CheckItemView mode="test" item={item} onChange={onChange} />);
    fireEvent.click(opt(container, '下'));
    expect(onChange).toHaveBeenCalledWith('下');
    expect(screen.queryByText('Belum tepat, coba lagi.')).toBeNull();
  });
});

describe('BottomActionBar', () => {
  it('shows the feedback sheet with the why line', () => {
    render(
      <ProgressProvider>
        <BottomActionBar feedback={why}>
          <button type="button">Lanjut</button>
        </BottomActionBar>
      </ProgressProvider>,
    );
    expect(screen.getByText('Tepat')).toBeInTheDocument();
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });
});
