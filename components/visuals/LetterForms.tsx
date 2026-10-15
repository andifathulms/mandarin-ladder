'use client';

import { useMemo, useState } from 'react';
import type { Letter } from '@/lib/types';
import { joinSafeSegments } from '@/lib/arabic/join';
import { isMark } from '@/lib/arabic/chars';
import { HIJAI } from '@/lib/arabic/alphabet';
import { ArIsland } from '../ar/ArIsland';
import { useRoving } from './useRoving';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';

export const POSITIONS = ['isolated', 'initial', 'medial', 'final'] as const;
export type Position = (typeof POSITIONS)[number];

const POS_LABEL: Record<Position, { id: string; en: string }> = {
  isolated: { id: 'sendiri', en: 'alone' },
  initial: { id: 'awal', en: 'start' },
  medial: { id: 'tengah', en: 'middle' },
  final: { id: 'akhir', en: 'end' },
};

/**
 * Splits a word around one occurrence of a letter (with its marks), so the letter can be coloured.
 * initial → first occurrence, final → last, medial → the first one that is neither first nor last.
 */
export function highlightLetter(word: string, letter: string, position: Position): [string, string, string] {
  const w = word.normalize('NFC');
  const idx: number[] = [];
  for (let i = 0; i < w.length; i++) if (w[i] === letter) idx.push(i);
  if (!idx.length) return [w, '', ''];
  const letters = [...w].map((c, i) => (isMark(c) ? -1 : i)).filter((i) => i >= 0);
  const firstL = letters[0];
  const lastL = letters[letters.length - 1];
  const at =
    position === 'final' ? idx[idx.length - 1] : position === 'medial' ? (idx.find((i) => i !== firstL && i !== lastL) ?? idx[0]) : idx[0];
  let end = at + 1;
  while (end < w.length && isMark(w[end])) end++;
  const [a, b, c] = joinSafeSegments([w.slice(0, at), w.slice(at, end), w.slice(end)]);
  return [a, b, c];
}

function FormCell({ l, position, active, lang }: { l: Letter; position: Position; active: boolean; lang: 'id' | 'en' }) {
  const word = position === 'isolated' ? null : l.example_words[position];
  const parts = word ? highlightLetter(word, l.letter, position) : null;
  const gap = !l.joins_left && (position === 'initial' || position === 'medial');
  return (
    <span
      className={`flex min-w-0 flex-col items-center gap-1 rounded-md border-2 px-2 py-2 transition-colors duration-quick ${
        active ? 'border-accent bg-accent-soft' : 'border-transparent bg-surface'
      }`}
    >
      <span className="label text-muted">{POS_LABEL[position][lang]}</span>
      <ArIsland block size="inherit" className="text-[1.9rem] leading-[1.7] min-[480px]:text-[2.4rem]" aria-hidden>
        {parts ? (
          <>
            {parts[0] && <span>{parts[0]}</span>}
            <span style={{ color: 'var(--subject)' }}>{parts[1]}</span>
            {parts[2] && <span>{parts[2]}</span>}
          </>
        ) : (
          <span style={{ color: 'var(--subject)' }}>{l.letter}</span>
        )}
      </ArIsland>
      <ArIsland face="ui" className="text-small text-muted" aria-hidden>
        {l.forms[position]}
      </ArIsland>
      {gap && (
        <span className="label flex items-center gap-1 text-muted" title={lang === 'en' ? 'never joins to the left' : 'tidak menyambung ke kiri'}>
          <span aria-hidden>⌐</span> {lang === 'en' ? 'no join left' : 'tidak menyambung ke kiri'}
        </span>
      )}
    </span>
  );
}

type Props = VisualProps<Position> & { letter?: string };

/**
 * LetterForms (DESIGN §8.1): a letter at glyph size, its four positional forms in real words (RTL:
 * sendiri on the right), a dot-family toggle, and the alphabet grid. Colour only, with ZWJ around the
 * coloured letter so joining is kept.
 */
export function LetterForms({ letter, state, interactive = true, onStateChange, lang }: Props) {
  const { letters } = useVisualData();
  const byLetter = useMemo(() => new Map(letters.map((l) => [l.letter, l])), [letters]);
  const [cur, setCur] = useState(letter && byLetter.has(letter) ? letter : 'ب');
  const [ownPos, setOwnPos] = useState<Position>('initial');
  const pos = state && POSITIONS.includes(state) ? state : ownPos;
  const setPos = (p: Position) => {
    setOwnPos(p);
    onStateChange?.(p);
  };
  // RTL order: sendiri sits on the right, so arrows follow the visual row.
  const roving = useRoving(POSITIONS, pos, setPos, 'rtl');
  const l = byLetter.get(cur) ?? letters[0];
  if (!l) return null;
  const family = letters.filter((x) => x.family === l.family && HIJAI.includes(x.letter));
  const alt =
    lang === 'en'
      ? `Letter ${l.name_id}, ${POS_LABEL[pos].en} form: ${l.forms[pos]}. ${l.joins_left ? '' : 'It never joins the next letter.'}`
      : `Huruf ${l.name_id}, bentuk ${POS_LABEL[pos].id}: ${l.forms[pos]}. ${l.joins_left ? '' : 'Tidak menyambung ke huruf berikutnya.'}`;

  return (
    <div className="flex flex-col gap-4" data-visual="letter-forms">
      <div className="flex flex-col items-center gap-1">
        <span className="relative grid place-items-center">
          {/* Family switches cross-fade: the bodies coincide, so only the dots seem to change. */}
          {family.map((f) => (
            <ArIsland
              key={f.letter}
              block
              size="glyph"
              face="display"
              aria-hidden
              className="col-start-1 row-start-1 text-ink transition-opacity duration-base"
              style={{ opacity: f.letter === l.letter ? 1 : 0 }}
            >
              {f.letter}
            </ArIsland>
          ))}
        </span>
        <span className="font-display text-body">
          {l.name_id} · <ArIsland face="ui">{l.name_ar}</ArIsland> · <span lang="ar-Latn">{l.tr}</span>
        </span>
      </div>

      <div role="radiogroup" aria-label={lang === 'en' ? 'Letter position' : 'Posisi huruf'} dir="rtl" onKeyDown={roving.onKeyDown} className="grid grid-cols-4 gap-2">
        {POSITIONS.map((p, i) => (
          <button key={p} type="button" {...roving.itemProps(p, i)} aria-label={`${l.name_id}, ${POS_LABEL[p][lang]}`} className="min-w-0 rounded-md text-start">
            <FormCell l={l} position={p} active={p === pos} lang={lang} />
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {alt}
      </p>

      {interactive && (
        <>
          {family.length > 1 && (
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={lang === 'en' ? 'Same shape, different dots' : 'Bentuk sama, titik berbeda'}>
              <span className="label text-muted">{lang === 'en' ? 'dots' : 'titik'}</span>
              {family.map((f) => (
                <button
                  key={f.letter}
                  type="button"
                  aria-pressed={f.letter === l.letter}
                  aria-label={f.name_id}
                  onClick={() => setCur(f.letter)}
                  className={`min-h-touch min-w-touch rounded-full border-2 px-3 transition-colors duration-quick ${
                    f.letter === l.letter ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'
                  }`}
                >
                  <ArIsland face="ui" className="text-ar-small leading-none">
                    {f.letter}
                  </ArIsland>
                </button>
              ))}
            </div>
          )}
          <div dir="rtl" className="grid grid-cols-7 gap-1" role="group" aria-label={lang === 'en' ? 'Alphabet' : 'Alfabet'}>
            {HIJAI.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === l.letter}
                aria-label={byLetter.get(c)?.name_id ?? c}
                onClick={() => setCur(c)}
                className={`min-h-touch rounded-sm transition-colors duration-quick ${c === l.letter ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-accent-soft'}`}
              >
                <ArIsland face="ui" className="text-[1.25rem] leading-none">
                  {c}
                </ArIsland>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
