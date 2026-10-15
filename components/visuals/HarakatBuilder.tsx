'use client';

import { useState } from 'react';
import { MARK_CHAR, MARK_LABEL, type MarkName } from '@/lib/arabic/marks';
import { SHADDA } from '@/lib/arabic/chars';
import { joinSafeSegments } from '@/lib/arabic/join';
import { LETTER_NAME } from '@/lib/arabic/names';
import { transliterate } from '@/lib/arabic/translit';
import { ArIsland } from '../ar/ArIsland';
import { useReducedMotion } from '../ProgressProvider';
import { usePlay } from '../useSpeech';
import type { VisualProps } from './types';

type Mad = 'mad-a' | 'mad-i' | 'mad-u';
type Choice = MarkName | Mad;

const SHORT: Choice[] = ['fatha', 'kasra', 'damma'];
const FULL: Choice[] = ['fatha', 'kasra', 'damma', 'sukun', 'shadda', 'tanwin-fath', 'tanwin-kasr', 'tanwin-damm', 'mad-a', 'mad-i', 'mad-u'];
const MAD: Record<Mad, { vowel: MarkName; letter: string; label: string }> = {
  'mad-a': { vowel: 'fatha', letter: 'ا', label: 'mad ā' },
  'mad-i': { vowel: 'kasra', letter: 'ي', label: 'mad ī' },
  'mad-u': { vowel: 'damma', letter: 'و', label: 'mad ū' },
};
const BELOW = new Set<Choice>(['kasra', 'tanwin-kasr', 'mad-i']);
const LETTERS = ['ب', 'ت', 'ن', 'م', 'ل', 'ك', 'س', 'د'];

const isVowel = (c: Choice | null) => !!c && c !== 'shadda' && c !== 'sukun';
const label = (c: Choice) => (c in MAD ? MAD[c as Mad].label : MARK_LABEL[c as MarkName]);
const glyph = (c: Choice) => (c in MAD ? MARK_CHAR[MAD[c as Mad].vowel] + MAD[c as Mad].letter : MARK_CHAR[c as MarkName]);

/** The syllable for a letter with an optional shaddah and one mark. */
export function syllable(letter: string, shadda: boolean, mark: Choice | null): string {
  let s = letter + (shadda ? SHADDA : '');
  if (!mark) return s;
  if (mark in MAD) return s + MARK_CHAR[MAD[mark as Mad].vowel] + MAD[mark as Mad].letter;
  if (mark === 'tanwin-fath') return s + MARK_CHAR[mark] + 'ا';
  return s + MARK_CHAR[mark as MarkName];
}

type Props = VisualProps<string> & { letter?: string; set?: 'short' | 'full' };

/**
 * HarakatBuilder (DESIGN §8.3): one consonant, then a mark. The mark appears in --harakat, the
 * syllable plays, and its transliteration shows large. In Huruf 1 only fathah, kasrah and dhammah;
 * Huruf 2 unlocks sukun, syaddah (stacked with a vowel), tanwin and mad.
 *
 * Colouring a combining mark apart from its letter would split the cluster, so two layers are drawn
 * in the same place: the whole syllable in --harakat, and the bare letter in ink on top of it.
 */
export function HarakatBuilder({ letter = 'ب', set = 'short', interactive = true, lang }: Props) {
  const reduced = useReducedMotion();
  const play = usePlay();
  const [base, setBase] = useState(LETTERS.includes(letter) ? letter : letter || 'ب');
  const [mark, setMark] = useState<Choice | null>('fatha');
  const [shadda, setShadda] = useState(false);
  const options = set === 'full' ? FULL : SHORT;

  const text = syllable(base, shadda, mark === 'shadda' ? null : mark);
  const tail = mark && (mark in MAD || mark === 'tanwin-fath') ? text.slice(-1) : '';
  // The ink layer keeps the same letter shapes as the coloured one (ZWJ across the split).
  const inkParts = joinSafeSegments([base, tail]);
  const tr = transliterate(text) || transliterate(base + 'َ').slice(0, -1);
  const choose = (c: Choice) => {
    if (c === 'shadda') {
      setShadda((v) => !v);
      if (!isVowel(mark)) setMark(null);
      void play(syllable(base, !shadda, isVowel(mark) ? mark : 'fatha'));
      return;
    }
    if (c === 'sukun') setShadda(false);
    setMark(c);
    void play(syllable(base, c === 'sukun' ? false : shadda, c));
  };
  const alt = `${LETTER_NAME[base] ?? base}${shadda ? ' syaddah' : ''}${mark && mark !== 'shadda' ? ` ${label(mark)}` : ''}: ${tr}`;

  return (
    <div className="flex flex-col gap-4" data-visual="harakat-builder">
      <div className="flex flex-col items-center gap-1 rounded-md bg-surface py-3">
        <span className="relative grid place-items-center" aria-hidden>
          <ArIsland
            key={`${text}-${reduced}`}
            block
            size="glyph"
            face="display"
            className={`col-start-1 row-start-1 text-harakat ${reduced ? '' : BELOW.has(mark as Choice) ? 'mark-rise' : 'mark-drop'}`}
          >
            {text}
          </ArIsland>
          <ArIsland block size="glyph" face="display" className="col-start-1 row-start-1 text-ink">
            {tail ? (
              <>
                {inkParts[0]}
                <span className="text-transparent">{inkParts[1]}</span>
              </>
            ) : (
              base
            )}
          </ArIsland>
        </span>
        <span className="font-display text-h1 tnum" lang="ar-Latn">
          {tr}
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>
      {interactive && (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'en' ? 'Vowel marks' : 'Harakat'}>
            {options.map((c) => {
              const on = c === 'shadda' ? shadda : mark === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  aria-label={label(c)}
                  onClick={() => choose(c)}
                  className={`flex min-h-[72px] min-w-[72px] flex-col items-center justify-center rounded-md border-2 px-2 transition-colors duration-quick ${
                    on ? 'border-accent bg-accent-soft' : 'border-rule bg-surface hover:border-accent'
                  }`}
                >
                  <ArIsland face="display" aria-hidden className="text-[2rem] leading-[1.3] text-harakat">
                    {`◌${glyph(c)}`}
                  </ArIsland>
                  <span className="text-small font-bold" lang="ar-Latn">
                    {label(c)}
                  </span>
                </button>
              );
            })}
          </div>
          <div dir="rtl" className="flex flex-wrap gap-1" role="group" aria-label={lang === 'en' ? 'Letter' : 'Huruf'}>
            {[...new Set([base, ...LETTERS])].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === base}
                aria-label={LETTER_NAME[c] ?? c}
                onClick={() => setBase(c)}
                className={`min-h-touch min-w-touch rounded-sm transition-colors duration-quick ${c === base ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-accent-soft'}`}
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
