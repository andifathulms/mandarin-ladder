import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sentence, segments } from '@/components/lesson/Sentence';
import { ProgressProvider } from '@/components/ProgressProvider';

const wrap = (ui: React.ReactNode) => render(<ProgressProvider>{ui}</ProgressProvider>);

describe('Sentence', () => {
  it('renders the focus word with the focus style and lang attributes', () => {
    const { container } = wrap(<Sentence en="The ball is [[under]] the table." id="Bolanya di bawah meja." />);
    const en = container.querySelector('p[lang="en"]')!;
    expect(en.textContent).toBe('The ball is under the table.');
    expect(container.querySelector('.focus-word')!.textContent).toBe('under');
    const idp = container.querySelector('p[lang="id"]')!;
    expect(idp).toHaveClass('id-text');
    expect(idp.textContent).toBe('Bolanya di bawah meja.');
  });

  it('reveals a note when the focus word is tapped', () => {
    wrap(<Sentence en="I [[am]] Budi." note={{ id: 'Am hanya dengan I.', en: 'Am goes with I.' }} />);
    fireEvent.click(screen.getByRole('button', { name: 'am' }));
    expect(screen.getByRole('note')).toHaveTextContent('Am hanya dengan I.');
  });

  it('hides the play button when speech is unavailable', () => {
    wrap(<Sentence en="I [[am]] Budi." />);
    expect(screen.queryByRole('button', { name: /Putar/ })).toBeNull();
  });

  it('maps segments to plain-text offsets', () => {
    const s = segments('I [[am]] Budi.');
    expect(s.map((x) => [x.text, x.start])).toEqual([
      ['I', 0],
      [' ', 1],
      ['am', 2],
      [' ', 4],
      ['Budi.', 5],
    ]);
  });
});
