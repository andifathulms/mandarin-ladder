'use client';

import { useState } from 'react';
import type { GlossaryEntry } from '@/lib/types';
import { ArIsland } from '../ar/ArIsland';
import { Translit } from '../ar/Translit';
import { PlayButton } from './PlayButton';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';

/** New words as chips: Arabic, transliteration, meaning, and audio (fixes English Ladder issue 15). */
export function GlossaryChips({ words }: { words: GlossaryEntry[] }) {
  const { lang } = useT();
  const play = usePlay();
  const [playing, setPlaying] = useState<string | null>(null);
  const run = async (s: string) => {
    setPlaying(s);
    await play(s);
    setPlaying(null);
  };
  return (
    <ul className="flex flex-wrap gap-2">
      {words.map((g) => (
        <li key={g.ar} className="card flex items-center gap-2 py-1 pe-1 ps-3">
          <span className="flex flex-col">
            <ArIsland size="small">{g.ar}</ArIsland>
            <span className="flex flex-wrap items-baseline gap-x-2">
              <Translit text={g.tr} />
              <span lang={lang === 'en' && g.en ? 'en' : 'id'} className="id-text text-small">
                {lang === 'en' ? (g.en ?? g.id) : g.id}
              </span>
            </span>
          </span>
          <PlayButton text={g.ar} onPlay={() => run(g.ar)} playing={playing === g.ar} small />
        </li>
      ))}
    </ul>
  );
}
