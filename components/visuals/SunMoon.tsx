'use client';

import { useState } from 'react';
import { SUN_LETTERS } from '@/lib/arabic/chars';
import { joinSafeSegments } from '@/lib/arabic/join';
import { LETTER_NAME } from '@/lib/arabic/names';
import { transliterate } from '@/lib/arabic/translit';
import { ArIsland } from '../ar/ArIsland';
import { useReducedMotion } from '../ProgressProvider';
import { usePlay } from '../useSpeech';
import type { VisualProps } from './types';

/** A short noun for every letter: [first letter, noun without al-, its meaning]. Fully vowelled. */
const NOUNS: [string, string, string][] = [
  ['ت', 'تَمْرُ', 'kurma'],
  ['ث', 'ثَوْبُ', 'baju'],
  ['د', 'دَرْسُ', 'pelajaran'],
  ['ذ', 'ذَهَبُ', 'emas'],
  ['ر', 'رَجُلُ', 'laki-laki'],
  ['ز', 'زَيْتُ', 'minyak'],
  ['س', 'سَمَكُ', 'ikan'],
  ['ش', 'شَمْسُ', 'matahari'],
  ['ص', 'صَدِيقُ', 'teman'],
  ['ض', 'ضَيْفُ', 'tamu'],
  ['ط', 'طَالِبُ', 'pelajar'],
  ['ظ', 'ظُهْرُ', 'tengah hari'],
  ['ل', 'لَيْلُ', 'malam'],
  ['ن', 'نَارُ', 'api'],
  ['أ', 'أَبُ', 'ayah'],
  ['ب', 'بَيْتُ', 'rumah'],
  ['ج', 'جَمَلُ', 'unta'],
  ['ح', 'حَلِيبُ', 'susu'],
  ['خ', 'خُبْزُ', 'roti'],
  ['ع', 'عَيْنُ', 'mata'],
  ['غ', 'غُرْفَةُ', 'kamar'],
  ['ف', 'فِيلُ', 'gajah'],
  ['ق', 'قَمَرُ', 'bulan'],
  ['ك', 'كَلْبُ', 'anjing'],
  ['م', 'مَاءُ', 'air'],
  ['ه', 'هِلَالُ', 'bulan sabit'],
  ['و', 'وَرْدُ', 'mawar'],
  ['ي', 'يَدُ', 'tangan'],
];

const SUN = NOUNS.filter(([c]) => SUN_LETTERS.has(c));
const MOON = NOUNS.filter(([c]) => !SUN_LETTERS.has(c));

/** The article word: al- + noun, with shaddah on a sun letter and sukun on the lam before a moon letter. */
export function withArticle(noun: string, sun: boolean): string {
  return sun ? `ال${noun[0]}ّ${noun.slice(1)}` : `الْ${noun}`;
}

const Sun = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

type Props = VisualProps<string> & { letter?: string };

/**
 * SunMoon (DESIGN §8.5): pick a letter and al- joins a noun. Before a sun letter the lam folds into
 * the next sound (it stays written, faded, and a syaddah appears in --harakat); before a moon letter
 * the lam takes a sukun and is said.
 */
export function SunMoon({ letter, interactive = true, lang }: Props) {
  const reduced = useReducedMotion();
  const play = usePlay();
  const [cur, setCur] = useState(NOUNS.find(([c]) => c === letter)?.[0] ?? 'ش');
  const [, noun, meaning] = NOUNS.find(([c]) => c === cur)!;
  const sun = SUN_LETTERS.has(cur);
  const word = withArticle(noun, sun);
  // Pieces: alif, lam, the first letter (+ its marks), the rest. ZWJ keeps them joined.
  const lamEnd = sun ? 2 : 3;
  let k = lamEnd + 1;
  while (k < word.length && /[\u064B-\u0652]/.test(word[k])) k++;
  const [alif, lam, head, rest] = joinSafeSegments([word.slice(0, 1), word.slice(1, lamEnd), word.slice(lamEnd, k), word.slice(k)]);
  const trNow = transliterate(word);
  const trNaive = `al-${transliterate(noun)}`;
  const alt =
    lang === 'en'
      ? `${word}: ${LETTER_NAME[cur]} is a ${sun ? 'sun' : 'moon'} letter, said ${trNow}.`
      : `${word}: ${LETTER_NAME[cur]} huruf ${sun ? 'syamsiyah' : 'qamariyah'}, dibaca ${trNow}.`;

  const board = (list: typeof NOUNS, isSun: boolean) => (
    <div className="flex flex-col gap-2">
      <p className="label flex items-center gap-2 text-muted">
        {isSun ? <Sun /> : <Moon />}
        {isSun ? (lang === 'en' ? 'sun letters' : 'syamsiyah') : lang === 'en' ? 'moon letters' : 'qamariyah'}
      </p>
      <div dir="rtl" className="grid grid-cols-7 gap-1">
        {list.map(([c]) => (
          <button
            key={c}
            type="button"
            aria-pressed={c === cur}
            aria-label={LETTER_NAME[c]}
            onClick={() => {
              setCur(c);
              const n = NOUNS.find(([x]) => x === c)!;
              void play(withArticle(n[1], SUN_LETTERS.has(c)));
            }}
            className={`min-h-touch rounded-sm transition-colors duration-quick ${c === cur ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-accent-soft'}`}
          >
            <ArIsland face="ui" className="text-[1.25rem] leading-none">
              {c}
            </ArIsland>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4" data-visual="sun-moon">
      <div className="flex flex-col items-center gap-1 rounded-md bg-surface py-3" aria-hidden>
        <ArIsland block size="sentence" className="text-center" key={cur}>
          <span>{alif}</span>
          <span
            style={{
              // Written but silent: muted (still readable, and above contrast targets).
              color: sun ? 'var(--muted)' : undefined,
              transition: reduced ? 'none' : 'color var(--m-object-d) var(--ease)',
            }}
          >
            {lam}
          </span>
          <span className={sun ? `text-harakat ${reduced ? '' : 'mark-drop'}` : undefined}>{head}</span>
          <span>{rest}</span>
        </ArIsland>
        <p className="flex flex-wrap items-baseline justify-center gap-2 font-display text-h2" lang="ar-Latn">
          {sun && <span className="off-text text-body">{trNaive}</span>}
          <span>{trNow}</span>
        </p>
        <p className="id-text text-small">
          {meaning}
          {sun ? (lang === 'en' ? ' · the lam is written, not said' : ' · lam ditulis, tidak dibaca') : lang === 'en' ? ' · the lam is said' : ' · lam dibaca'}
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>
      {interactive && (
        <div className="grid gap-4 min-[640px]:grid-cols-2">
          {board(MOON, false)}
          {board(SUN, true)}
        </div>
      )}
    </div>
  );
}
