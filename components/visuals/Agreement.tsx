'use client';

import { useState } from 'react';
import { DAMMA, DAMMATAN, FATHA, SHADDA, SUN_LETTERS } from '@/lib/arabic/chars';
import { joinSafeSegments } from '@/lib/arabic/join';
import { transliterate } from '@/lib/arabic/translit';
import { ArIsland } from '../ar/ArIsland';
import { Translit } from '../ar/Translit';
import { usePlay } from '../useSpeech';
import type { VisualProps } from './types';

type Noun = { ar: string; id: string; f: boolean };
const NOUNS: Noun[] = [
  { ar: 'بَيْتٌ', id: 'rumah', f: false },
  { ar: 'كِتَابٌ', id: 'buku', f: false },
  { ar: 'قَلَمٌ', id: 'pena', f: false },
  { ar: 'سَيَّارَةٌ', id: 'mobil', f: true },
  { ar: 'مَدْرَسَةٌ', id: 'sekolah', f: true },
  { ar: 'غُرْفَةٌ', id: 'kamar', f: true },
];
const ADJS = [
  { ar: 'كَبِيرٌ', id: 'besar' },
  { ar: 'صَغِيرٌ', id: 'kecil' },
  { ar: 'جَدِيدٌ', id: 'baru' },
  { ar: 'جَمِيلٌ', id: 'indah' },
];

const stem = (w: string) => w.replace(new RegExp(`${DAMMATAN}$`), '');

/** One word of the phrase as pieces: [al-, body, feminine ending], with the ending -un or -u. */
export function agreeWord(word: string, opts: { definite: boolean; feminine?: boolean }): [string, string, string] {
  let body = stem(word);
  let fem = '';
  if (opts.feminine) {
    fem = 'ة' + (opts.definite ? DAMMA : DAMMATAN);
    body = body + FATHA;
  } else if (!body.endsWith('ة')) {
    body = body + (opts.definite ? DAMMA : DAMMATAN);
  } else {
    body = body.slice(0, -1);
    fem = 'ة' + (opts.definite ? DAMMA : DAMMATAN);
  }
  if (!opts.definite) return ['', body, fem];
  // al- before a sun letter: the letter takes a shaddah.
  const first = body[0];
  if (SUN_LETTERS.has(first)) body = first + SHADDA + body.slice(1);
  return ['ال', body, fem];
}

type Props = VisualProps<string> & { noun?: string; adjective?: string; definite?: boolean };

/**
 * Agreement (DESIGN §8.7): a noun and an adjective. A feminine noun gives the adjective ة, and
 * "definite" puts al- on both words; what changed is shown in --subject (colour only, joins kept).
 */
export function Agreement({ noun, adjective, definite: def = false, interactive = true, lang }: Props) {
  const play = usePlay();
  const [n, setN] = useState(NOUNS.find((x) => x.ar === noun) ?? NOUNS[0]);
  const [a, setA] = useState(ADJS.find((x) => x.ar === adjective) ?? ADJS[0]);
  const [definite, setDefinite] = useState(def);
  const nw = agreeWord(n.ar, { definite });
  const aw = agreeWord(a.ar, { definite, feminine: n.f });
  const phrase = `${nw.join('')} ${aw.join('')}`;
  const [n0, n1, n2] = joinSafeSegments(nw);
  const [a0, a1, a2] = joinSafeSegments(aw);
  const hi = { color: 'var(--subject)' };
  const meaning = `${n.id} ${definite ? 'yang ' : ''}${a.id}`;

  const chip = (on: boolean) =>
    `min-h-touch rounded-full border-2 px-4 transition-colors duration-quick ${on ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'}`;

  return (
    <div className="flex flex-col gap-4" data-visual="agreement">
      <div className="flex flex-col items-center gap-1 rounded-md bg-surface px-3 py-3">
        <ArIsland block size="sentence" className="text-center" aria-label={phrase}>
          {n0 && <span style={hi}>{n0}</span>}
          <span>{n1}</span>
          {n2 && <span>{n2}</span>} {a0 && <span style={hi}>{a0}</span>}
          <span>{a1}</span>
          {a2 && <span style={n.f ? hi : undefined}>{a2}</span>}
        </ArIsland>
        <Translit text={transliterate(phrase)} />
        <p className="id-text">{meaning}</p>
      </div>
      <p className="text-small">{lang === 'en' ? 'The adjective follows the gender and the al- of its noun.' : 'Kata sifat ikut jenis dan al- kata bendanya.'}</p>
      <p className="sr-only" aria-live="polite">
        {phrase}: {meaning}
      </p>
      {interactive && (
        <div className="grid gap-4 min-[640px]:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="label text-muted">{lang === 'en' ? 'noun' : 'kata benda'}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'en' ? 'Noun' : 'Kata benda'}>
              {NOUNS.map((x) => (
                <button key={x.ar} type="button" aria-pressed={x === n} className={chip(x === n)} onClick={() => setN(x)}>
                  <ArIsland className="text-ar-small leading-none">{x.ar}</ArIsland>{' '}
                  <span className="label ms-1 rounded-sm bg-paper-2 px-1 text-muted">{x.f ? 'f' : 'm'}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="label text-muted">{lang === 'en' ? 'adjective' : 'kata sifat'}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'en' ? 'Adjective' : 'Kata sifat'}>
              {ADJS.map((x) => (
                <button key={x.ar} type="button" aria-pressed={x === a} className={chip(x === a)} onClick={() => setA(x)}>
                  <ArIsland className="text-ar-small leading-none">{x.ar}</ArIsland>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" role="switch" aria-checked={definite} className={chip(definite)} onClick={() => setDefinite((v) => !v)}>
              {lang === 'en' ? 'definite (al-)' : 'tertentu (al-)'}
            </button>
            <button type="button" className="btn btn-quiet min-h-touch px-3" onClick={() => void play(phrase)}>
              {lang === 'en' ? 'Play' : 'Putar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
