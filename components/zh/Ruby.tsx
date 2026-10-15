import { Fragment } from 'react';
import type { AlignedWord } from '@/lib/zh/align';
import { pyDisplay, toneClass } from './Pinyin';

type Props = {
  word: AlignedWord;
  /** Pinyin visible; when false the rt keeps its space (visibility: hidden) so lines never jump. */
  showPinyin: boolean;
  toneColours: boolean;
  /** Spoken tones per character, when sandhi colouring is wanted (Nada card). Defaults to authored. */
  spokenTones?: number[];
};

/**
 * One word as one <ruby>, with one <rt> per character so the pinyin sits exactly over each hanzi
 * (DESIGN §4.3). Tone colour classes go on both the hanzi and its rt.
 */
export function RubyWord({ word, showPinyin, toneColours, spokenTones }: Props) {
  if (!word.chars.length) return <span>{word.text}</span>;
  return (
    <ruby className="zh-ruby">
      {word.chars.map((c, i) => {
        const tone = spokenTones?.[i] ?? c.syl.tone;
        const cls = toneColours ? toneClass(tone) : undefined;
        return (
          <Fragment key={i}>
            <span className={cls}>{c.ch}</span>
            <rt lang="zh-Latn-pinyin" className={`${cls ?? ''} ${showPinyin ? '' : 'rt-hidden'}`.trim()} aria-hidden>
              {pyDisplay(c.syl.erhua ? 'r' : c.syl.text)}
            </rt>
          </Fragment>
        );
      })}
    </ruby>
  );
}
