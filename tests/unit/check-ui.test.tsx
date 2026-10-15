import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { OptionPill } from '@/components/check/OptionPill';
import { CheckItemView } from '@/components/check/CheckItemView';
import { ProgressProvider } from '@/components/ProgressProvider';
import { BottomActionBar } from '@/components/lesson/BottomActionBar';
import type { CheckItem } from '@/lib/types';

const wrap = (ui: React.ReactNode) => render(<ProgressProvider>{ui}</ProgressProvider>);
const why = { id: 'Di atas: عَلَى.', en: 'On top: عَلَى.' };
const item: CheckItem = {
  id: 'x1',
  type: 'gap',
  cue: 'Kuncinya di atas meja.',
  prompt: 'المِفْتَاحُ ___ الطَّاوِلَةِ.',
  options: ['فِي', 'عَلَى', 'تَحْتَ'],
  answer: 'عَلَى',
  why,
};
const name = (ar: string) => ({ name: new RegExp(ar) });

describe('OptionPill', () => {
  it.each(['idle', 'correct', 'wrong', 'selected'] as const)('renders %s state with the Arabic in an RTL island', (state) => {
    const { container } = wrap(<OptionPill label="عَلَى" state={state} index={0} onClick={() => {}} badge />);
    const b = screen.getByRole('button', name('عَلَى'));
    expect(b).toHaveAttribute('data-state', state);
    const island = container.querySelector('[lang="ar"][dir="rtl"]')!;
    expect(island.textContent).toBe('عَلَى');
  });
  it('marks transliteration options as ar-Latn and Indonesian as id', () => {
    wrap(
      <>
        <OptionPill label="al-qamaru" state="idle" index={0} onClick={() => {}} />
        <OptionPill label="ʿalā" state="idle" index={1} onClick={() => {}} />
        <OptionPill label="buku" state="idle" index={2} onClick={() => {}} />
      </>,
    );
    expect(screen.getByRole('button', { name: 'ʿalā' })).toHaveAttribute('lang', 'ar-Latn');
    expect(screen.getByRole('button', { name: 'buku' })).toHaveAttribute('lang', 'id');
  });
  it('is disabled when told', () => {
    wrap(<OptionPill label="فِي" state="wrong" index={0} disabled onClick={() => {}} />);
    expect(screen.getByRole('button', name('فِي'))).toBeDisabled();
  });
});

describe('CheckItemView (practice)', () => {
  it('keeps the item open on a wrong answer, then solves with firstTry=false', () => {
    const onSolved = vi.fn();
    wrap(<CheckItemView mode="practice" item={item} onSolved={onSolved} />);
    fireEvent.click(screen.getByRole('button', name('فِي')));
    expect(screen.getByText('Belum tepat, coba lagi.')).toBeInTheDocument();
    expect(screen.getByRole('button', name('فِي'))).toBeDisabled();
    expect(onSolved).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', name('عَلَى')));
    expect(onSolved).toHaveBeenCalledWith(false);
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });

  it('shows the why line as a hint after two misses', () => {
    wrap(<CheckItemView mode="practice" item={item} onSolved={() => {}} />);
    fireEvent.click(screen.getByRole('button', name('فِي')));
    expect(screen.queryByText(why.id)).toBeNull();
    fireEvent.click(screen.getByRole('button', name('تَحْتَ')));
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });

  it('picks answers with number keys', () => {
    const onSolved = vi.fn();
    wrap(<CheckItemView mode="practice" item={item} onSolved={onSolved} />);
    fireEvent.keyDown(window, { key: '2' });
    expect(onSolved).toHaveBeenCalledWith(true);
  });
});

describe('feedback sheet', () => {
  it('leaves the why line to the sheet when whyInSheet is set', () => {
    wrap(<CheckItemView mode="practice" item={item} onSolved={() => {}} whyInSheet />);
    fireEvent.click(screen.getByRole('button', name('عَلَى')));
    expect(screen.queryByText(why.id)).toBeNull();
  });

  it('still shows the hint after two misses with whyInSheet', () => {
    wrap(<CheckItemView mode="practice" item={item} onSolved={() => {}} whyInSheet />);
    fireEvent.click(screen.getByRole('button', name('فِي')));
    fireEvent.click(screen.getByRole('button', name('تَحْتَ')));
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });

  it('shows Tepat and the why line in the bottom bar', () => {
    wrap(
      <BottomActionBar feedback={why}>
        <button type="button">Lanjut</button>
      </BottomActionBar>,
    );
    expect(screen.getByText('Tepat')).toBeInTheDocument();
    expect(screen.getByText(why.id)).toBeInTheDocument();
  });
});

describe('CheckItemView (listen)', () => {
  const listen: CheckItem = {
    id: 'l1',
    type: 'listen',
    variety: 'fusha',
    audio: 'أَنَا تَعْبَانُ.',
    options: ['أَنَا تَعْبَانُ.', 'أَنْتَ تَعْبَانُ.'],
    answer: 'أَنَا تَعْبَانُ.',
    why,
  };
  it('shows the text when nothing can play it, and still grades', () => {
    const onSolved = vi.fn();
    wrap(<CheckItemView mode="practice" item={listen} onSolved={onSolved} />);
    expect(screen.getByText(/Tidak ada rekaman atau suara bahasa Arab/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', name('أَنَا تَعْبَانُ')));
    expect(onSolved).toHaveBeenCalledWith(true);
  });
});

describe('Arabic item types', () => {
  it('spell: the answer line is one joined island, and tapping it removes the last letter', () => {
    const spell: CheckItem = { id: 's1', type: 'spell', match: 'exact', letters: ['ك', 'ت', 'ا', 'ب'], distractors: ['ن'], answer: 'كتاب', why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={spell} onSolved={onSolved} />);
    for (const l of ['ك', 'ت', 'ا']) fireEvent.click(container.querySelector(`[data-tile="${l}"]`)!);
    const line = container.querySelector('[data-answer-line]')!;
    const islands = line.querySelectorAll('[lang="ar"]');
    expect(islands).toHaveLength(1);
    expect(islands[0].textContent).toBe('كتا');
    expect(islands[0].children).toHaveLength(0);
    fireEvent.click(line);
    expect(line.querySelector('[lang="ar"]')!.textContent).toBe('كت');
    fireEvent.click(container.querySelector('[data-tile="ا"]')!);
    fireEvent.click(container.querySelector('[data-tile="ب"]')!);
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('spell tiles have letter names as accessible names', () => {
    const spell: CheckItem = { id: 's2', type: 'spell', match: 'exact', letters: ['ك', 'ت'], distractors: [], answer: 'كت', why };
    wrap(<CheckItemView mode="practice" item={spell} onSolved={() => {}} />);
    expect(screen.getByRole('button', { name: 'kaf' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ta' })).toBeInTheDocument();
  });

  it('read: shows the Arabic without transliteration and grades the Latin option', () => {
    const read: CheckItem = { id: 'r1', type: 'read', match: 'exact', ar: 'الْقَمَرُ', options: ['al-qamaru', 'qamarun'], answer: 'al-qamaru', why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={read} onSolved={onSolved} />);
    expect(container.querySelector('p[lang="ar"]')!.textContent).toBe('الْقَمَرُ');
    expect(container.querySelector('p[lang="ar-Latn"]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'al-qamaru' }));
    expect(onSolved).toHaveBeenCalledWith(true);
  });

  it('mark: hides the target mark and picks by mark name', () => {
    const mark: CheckItem = { id: 'm1', type: 'mark', match: 'exact', ar: 'دَرْسٌ', target: 1, options: ['fatha', 'sukun', 'kasra'], answer: 'sukun', why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={mark} onSolved={onSolved} />);
    const word = container.querySelector('p[lang="ar"]')!;
    expect(word.textContent).toBe('دَرسٌ');
    fireEvent.click(screen.getByRole('button', { name: 'fathah' }));
    expect(onSolved).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'sukun' }));
    expect(onSolved).toHaveBeenCalledWith(false);
  });

  it('order: Arabic word tiles flow right to left', () => {
    const order: CheckItem = { id: 'o1', type: 'order', tiles: ['كَبِيرٌ', 'البَيْتُ'], answer: ['البَيْتُ', 'كَبِيرٌ'], why };
    const onSolved = vi.fn();
    const { container } = wrap(<CheckItemView mode="practice" item={order} onSolved={onSolved} />);
    expect(container.querySelector('[role="group"][dir="rtl"]')).not.toBeNull();
    fireEvent.click(container.querySelector('[data-tile="البَيْتُ"]')!);
    fireEvent.click(container.querySelector('[data-tile="كَبِيرٌ"]')!);
    fireEvent.click(screen.getByRole('button', { name: 'Periksa' }));
    expect(onSolved).toHaveBeenCalledWith(true);
  });
});

describe('mixed prompts', () => {
  it('keeps an Indonesian question LTR and puts the quoted Arabic in an island', () => {
    const q: CheckItem = { id: 'q1', type: 'choice', match: 'exact', prompt: 'Huruf ini namanya apa? ذ', options: ['dal', 'dzal'], answer: 'dzal', why };
    const { container } = wrap(<CheckItemView mode="practice" item={q} onSolved={() => {}} />);
    const p = container.querySelector('p[lang="id"].text-sentence')!;
    expect(p.textContent).toContain('Huruf ini namanya apa?');
    expect(p.querySelector('bdi[dir="rtl"]')!.textContent).toBe('ذ');
    expect(container.querySelector('p[dir="rtl"]')).toBeNull();
  });
});
