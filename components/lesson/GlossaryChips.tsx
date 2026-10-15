'use client';

import { useState } from 'react';
import type { GlossaryEntry } from '@/lib/types';
import { ZhText } from '../zh/ZhText';
import { Pinyin } from '../zh/Pinyin';
import { PlayButton } from './PlayButton';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';
import { useZhText } from '../zh/ZhContext';

/** New words as chips: hanzi, pinyin, meaning, measure word, and audio (fixes English Ladder issue 15). */
export function GlossaryChips({ words }: { words: GlossaryEntry[] }) {
  const { lang } = useT();
  const { toneColours } = useZhText();
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
        <li key={`${g.zh}${g.py}`} className="card flex items-center gap-2 py-1 pe-1 ps-3">
          <span className="flex flex-col">
            <span className="flex items-baseline gap-2">
              <ZhText className="text-zh-small">{g.zh.replace(/\s+/g, '')}</ZhText>
              <Pinyin text={g.py} tones={toneColours} className="text-small" />
            </span>
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span lang={lang === 'en' && g.en ? 'en' : 'id'} className="id-text text-small">
                {lang === 'en' ? (g.en ?? g.id) : g.id}
              </span>
              {g.mw && (
                <ZhText face="ui" className="label text-accent">
                  {`一${g.mw}`}
                </ZhText>
              )}
            </span>
          </span>
          <PlayButton text={g.zh} onPlay={() => run(g.zh)} playing={playing === g.zh} small />
        </li>
      ))}
    </ul>
  );
}
