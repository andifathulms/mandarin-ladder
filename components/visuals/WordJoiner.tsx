'use client';

import { useState } from 'react';
import { HIJAI } from '@/lib/arabic/alphabet';
import { joinsLeft, joinsRight } from '@/lib/arabic/chars';
import { LETTER_NAME } from '@/lib/arabic/names';
import { ArIsland } from '../ar/ArIsland';
import { useReducedMotion } from '../ProgressProvider';
import { usePlay } from '../useSpeech';
import type { VisualProps } from './types';

export const PRESETS = ['كتب', 'مدرسة', 'بيت', 'قلم', 'ورد'] as const;
type Form = 'sendiri' | 'awal' | 'tengah' | 'akhir';

/** The positional form each letter takes in a word, from the joining rules alone. */
export function formsOf(letters: string[]): Form[] {
  return letters.map((c, i) => {
    const fromRight = i > 0 && joinsLeft(letters[i - 1]) && joinsRight(c);
    const toLeft = i < letters.length - 1 && joinsLeft(c) && joinsRight(letters[i + 1]);
    return fromRight && toLeft ? 'tengah' : toLeft ? 'awal' : fromRight ? 'akhir' : 'sendiri';
  });
}

const FORM_EN: Record<Form, string> = { sendiri: 'alone', awal: 'start', tengah: 'middle', akhir: 'end' };

type Props = VisualProps<string> & { preset?: string; letters?: string[] };

/**
 * WordJoiner (DESIGN §8.2): tap letters (isolated forms) and watch them join into a word above, with
 * each letter's form named underneath. Lepas pulls the word back apart into isolated letters.
 */
export function WordJoiner({ preset, letters: initial, interactive = true, lang }: Props) {
  const reduced = useReducedMotion();
  const play = usePlay();
  const start = initial ?? [...(preset && PRESETS.includes(preset as (typeof PRESETS)[number]) ? preset : PRESETS[0])];
  const [word, setWord] = useState<string[]>(start);
  const [apart, setApart] = useState(false);
  const forms = formsOf(word);
  const L = (f: Form) => (lang === 'en' ? FORM_EN[f] : f);
  const alt = word.map((c, i) => `${LETTER_NAME[c] ?? c} ${L(forms[i])}`).join(', ');

  return (
    <div className="flex flex-col gap-4" data-visual="word-joiner">
      <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-md bg-surface px-3 py-3">
        {apart ? (
          <div dir="rtl" className="flex flex-wrap justify-center gap-3" aria-hidden>
            {word.map((c, i) => (
              <ArIsland key={`${c}${i}`} size="sentence" className={`rounded-sm border-2 border-rule px-3 ${reduced ? '' : 'fade-in'}`}>
                {c}
              </ArIsland>
            ))}
          </div>
        ) : (
          <ArIsland block size="sentence" className={`text-center ${reduced ? '' : 'fade-in'}`} key={word.join('')} aria-hidden>
            {word.join('') || ' '}
          </ArIsland>
        )}
        <div dir="rtl" className="flex flex-wrap justify-center gap-x-3 gap-y-1" aria-hidden>
          {word.map((c, i) => (
            <span key={`${c}${i}`} className="flex items-baseline gap-1">
              <ArIsland face="ui" className="text-small text-ink">
                {c}
              </ArIsland>
              <span className="label text-muted">{L(forms[i])}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>

      {interactive && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn btn-ghost min-h-touch px-4" aria-pressed={apart} onClick={() => setApart((v) => !v)}>
              {lang === 'en' ? (apart ? 'Join' : 'Pull apart') : apart ? 'Sambung' : 'Lepas'}
            </button>
            <button type="button" className="btn btn-quiet min-h-touch px-3" onClick={() => setWord((w) => w.slice(0, -1))} disabled={!word.length}>
              {lang === 'en' ? 'Remove last' : 'Hapus terakhir'}
            </button>
            <button type="button" className="btn btn-quiet min-h-touch px-3" onClick={() => void play(word.join(''))} disabled={!word.length}>
              {lang === 'en' ? 'Play' : 'Putar'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'en' ? 'Words to try' : 'Kata untuk dicoba'}>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={word.join('') === p}
                onClick={() => {
                  setWord([...p]);
                  setApart(false);
                }}
                className={`min-h-touch rounded-full border-2 px-4 transition-colors duration-quick ${
                  word.join('') === p ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'
                }`}
              >
                <ArIsland className="text-ar-small leading-none">{p}</ArIsland>
              </button>
            ))}
          </div>
          <div dir="rtl" className="grid grid-cols-7 gap-1" role="group" aria-label={lang === 'en' ? 'Add a letter' : 'Tambah huruf'}>
            {[...HIJAI, 'ة'].map((c) => (
              <button
                key={c}
                type="button"
                aria-label={LETTER_NAME[c]}
                onClick={() => setWord((w) => (w.length < 8 ? [...w, c] : w))}
                className="min-h-touch rounded-sm bg-surface text-ink transition-colors duration-quick hover:bg-accent-soft"
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
