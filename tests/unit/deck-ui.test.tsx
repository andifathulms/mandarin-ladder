import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ProgressProvider } from '@/components/ProgressProvider';
import { DeckHome, type Deck } from '@/components/zh/DeckHome';
import * as store from '@/lib/progress/store';

const deck: Deck = {
  rung: 'easy-1',
  name: 'Easy 1',
  hsk: '1',
  words: Array.from({ length: 12 }, (_, i) => ({
    id: `w-1-${i}`,
    zh: i % 2 ? '好' : '爱',
    py: i % 2 ? 'hǎo' : 'ài',
    mean: i % 2 ? `baik ${i}` : `cinta ${i}`,
    meanLang: 'id' as const,
    hsk: '1',
  })),
};

const wrap = () => render(<ProgressProvider><DeckHome decks={[deck]} /></ProgressProvider>);

beforeEach(() => {
  localStorage.clear();
  store.__resetForTests();
});

describe('DeckHome and DeckRunner', () => {
  it('shows the day plan, studies cards and saves the grades', () => {
    wrap();
    expect(screen.getByText('Kartu kata HSK 1')).toBeInTheDocument();
    expect(screen.getByText('Hari ini: 10 baru · 0 diulang')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Mulai/ }));
    for (let k = 0; k < 10; k++) {
      fireEvent.click(screen.getByRole('button', { name: 'Balik kartu' }));
      fireEvent.click(screen.getByRole('button', { name: k % 3 ? 'Ingat' : 'Belum ingat' }));
    }
    expect(screen.getByText('Selesai untuk hari ini. Kartu yang belum ingat akan muncul lagi besok.')).toBeInTheDocument();
    const s = store.getState().deck;
    expect(Object.keys(s)).toHaveLength(10);
    expect(Object.values(s).filter((c) => c.box === 2)).toHaveLength(6);
    expect(Object.values(s).filter((c) => c.box === 1)).toHaveLength(4);
    fireEvent.click(screen.getByRole('button', { name: 'Kembali ke kartu kata' }));
    // The daily allowance is used up.
    expect(screen.getByText('Hari ini: 0 baru · 0 diulang')).toBeInTheDocument();
  });

  it('filters the list and searches by pinyin without tones', () => {
    wrap();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'hao' } });
    expect(screen.getAllByText(/baik/)).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'dipelajari' }));
    expect(screen.getByText('Tidak ada kata yang cocok.')).toBeInTheDocument();
  });
});
