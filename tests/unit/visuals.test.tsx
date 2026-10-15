import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressProvider } from '@/components/ProgressProvider';
import { VisualDataProvider } from '@/components/visuals/VisualData';
import { visualData } from '@/lib/content/visualData';
import { ToneContour, tonePath } from '@/components/visuals/ToneContour';
import { SyllableBuilder, markRule } from '@/components/visuals/SyllableBuilder';
import { MouthPlaces } from '@/components/visuals/MouthPlaces';
import { SandhiStrip } from '@/components/visuals/SandhiStrip';
import { CharacterParts } from '@/components/visuals/CharacterParts';
import { registry } from '@/components/visuals/registry';

const data = visualData(['妈', '好'], { examples: true });
const wrap = (ui: React.ReactNode) =>
  render(
    <ProgressProvider>
      <VisualDataProvider value={data}>{ui}</VisualDataProvider>
    </ProgressProvider>,
  );

describe('ToneContour', () => {
  it('draws a different contour for each tone', () => {
    const paths = [1, 2, 3, 4, 0].map((t) => tonePath(t as 0));
    expect(new Set(paths).size).toBe(5);
  });
  it('picks a tone and names it, with a text alternative', () => {
    wrap(<ToneContour lang="id" />);
    fireEvent.click(screen.getByRole('radio', { name: 'nada 3' }));
    expect(screen.getByRole('img').getAttribute('aria-label')!.normalize('NFC')).toMatch(/^mǎ: nada 3, turun lalu naik \(214\)/);
  });
  it('moves between tones with arrow keys (roving focus)', () => {
    wrap(<ToneContour lang="id" />);
    const first = screen.getByRole('radio', { name: 'nada 1' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'nada 2' })).toHaveAttribute('aria-checked', 'true');
  });
});

describe('SyllableBuilder', () => {
  it('spells, marks and explains the tone-mark rule', () => {
    const { container } = wrap(<SyllableBuilder lang="id" />);
    expect(container.querySelector('[data-syllable]')!.getAttribute('data-syllable')).toBe('ma');
    expect(screen.getByText('Tanda nada di atas a atau e dulu.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'j' }));
    fireEvent.click(screen.getByRole('button', { name: 'ü' }));
    expect(container.querySelector('[data-syllable]')!.getAttribute('data-syllable')).toBe('ju');
  });
  it('greys out syllables Mandarin does not have', () => {
    wrap(<SyllableBuilder lang="id" initial={{ initial: 'b', final: 'ü', tone: 1 }} />);
    expect(screen.getByText('Suku kata ini tidak ada dalam bahasa Mandarin.')).toBeInTheDocument();
  });
  it('shows a real word with the syllable', () => {
    wrap(<SyllableBuilder lang="id" initial={{ initial: 'm', final: 'a', tone: 1 }} />);
    expect(screen.getByText('contoh')).toBeInTheDocument();
  });
  it('knows the three placement rules', () => {
    expect(markRule('hao')).toBe('ae');
    expect(markRule('gou')).toBe('ou');
    expect(markRule('liu')).toBe('last');
  });
});

describe('MouthPlaces', () => {
  it('moves the tongue for each place and adds a puff for aspirated initials', () => {
    const { container } = wrap(<MouthPlaces lang="id" />);
    fireEvent.click(screen.getByRole('radio', { name: /Lidah melengkung/ }));
    expect(container.querySelector('[data-tongue]')).toHaveAttribute('data-tongue', 'curled');
    expect(container.querySelector('svg g[aria-hidden]')).toBeNull();
    fireEvent.click(screen.getByRole('switch'));
    expect(container.querySelector('svg g[aria-hidden]')).not.toBeNull();
  });
});

describe('SandhiStrip', () => {
  it('shows written tones, then the spoken change with its rule', () => {
    const { container } = wrap(<SandhiStrip lang="id" />);
    expect(container.querySelector('[data-changed]')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'diucapkan' }));
    const changed = container.querySelectorAll('[data-changed]');
    expect(changed).toHaveLength(1);
    expect(changed[0]).toHaveTextContent('2');
    expect(screen.getByText('Nada 3 + nada 3: yang pertama diucapkan nada 2.')).toBeInTheDocument();
  });
  it('turns 不 into bú before tone 4', () => {
    wrap(<SandhiStrip lang="id" initial={{ preset: 2, mode: 'spoken' }} />);
    expect(screen.getByText('不 sebelum nada 4 diucapkan bú.')).toBeInTheDocument();
  });
});

describe('CharacterParts', () => {
  it('splits 妈 into its meaning and sound parts', () => {
    wrap(<CharacterParts char="妈" lang="id" />);
    fireEvent.click(screen.getByRole('button', { name: 'Pisahkan' }));
    const img = screen.getByRole('img');
    expect(img.getAttribute('aria-label')).toMatch(/^妈 = 女 \(kiri, perempuan\) \+ 马 \(kanan/);
    expect(screen.getAllByText(/bunyi/).length).toBeGreaterThan(0);
  });
  it('shows other characters sharing a part', () => {
    wrap(<CharacterParts char="妈" lang="id" />);
    fireEvent.click(screen.getByRole('button', { name: 'Pisahkan' }));
    fireEvent.click(screen.getByRole('button', { name: /女.*kiri/ }));
    expect(screen.getByText('Karakter lain dengan 女:')).toBeInTheDocument();
  });
});

describe('registry', () => {
  it('has the Dasar visuals', () => {
    for (const id of ['tone-contour', 'syllable-builder', 'mouth-places', 'sandhi-strip', 'stroke-order', 'character-parts'] as const) {
      expect(registry[id]).toBeDefined();
    }
  });
});
