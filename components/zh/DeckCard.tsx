'use client';

import { useRef, useState } from 'react';
import { ZhText } from './ZhText';
import { Pinyin } from './Pinyin';
import { ZhSentence } from './ZhSentence';
import { ZhTextOverride } from './ZhContext';
import { PlayButton } from '../lesson/PlayButton';
import { StrokeOrder } from '../visuals/StrokeOrder';
import { IconPlay } from '../ui/Icon';
import { usePlay } from '../useSpeech';
import { useSettings, useT } from '../ProgressProvider';
import { hanChars } from '@/lib/zh/text';

/** One word of a deck, as the page hands it to the client. */
export type DeckWord = {
  id: string;
  zh: string;
  py: string;
  /** Indonesian meaning; English when no Indonesian has been written yet (meanLang says which). */
  mean: string;
  meanLang: 'id' | 'en';
  mw?: string;
  trad?: string;
  hsk: string;
  /** An example sentence (authored for the deck, or from a lesson). */
  ex?: { zh: string; py: string; id: string };
  /** The lesson that teaches it, if any. */
  lesson?: string;
};

type Props = { word: DeckWord; face: 'hanzi' | 'meaning' | 'audio'; onGrade: (remembered: boolean) => void };

/**
 * A deck card in focus mode (DESIGN §6.8). The front shows the hanzi on the grid, the meaning, or a
 * play button (the Settings face); tap to flip. The back has the hanzi, tone-coloured pinyin, the
 * meaning, the measure word, one example with audio and stroke order. Two grades, Belum ingat and
 * Ingat; on phones a swipe left or right does the same.
 */
export function DeckCard({ word, face, onGrade }: Props) {
  const { t, lang } = useT();
  const { toneColours } = useSettings();
  const play = usePlay();
  const [flipped, setFlipped] = useState(false);
  const [strokes, setStrokes] = useState<string | null>(null);
  const start = useRef<number | null>(null);
  const [dx, setDx] = useState(0);
  const tones = toneColours !== false;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!flipped) return;
    start.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (start.current !== null) setDx(e.clientX - start.current);
  };
  const onPointerUp = () => {
    if (start.current === null) return;
    start.current = null;
    if (Math.abs(dx) > 80) onGrade(dx > 0);
    setDx(0);
  };

  const front =
    face === 'hanzi' ? (
      <ZhText className="tianzige flex h-[140px] w-[140px] items-center justify-center rounded-md bg-paper-2 text-zh-glyph font-medium leading-none">{word.zh}</ZhText>
    ) : face === 'meaning' ? (
      <p lang={word.meanLang} className="id-text text-center text-h2">
        {word.mean}
      </p>
    ) : (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void play(word.zh);
        }}
        aria-label={t('deck.playWord')}
        className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-accent text-accent-ink"
        data-play
      >
        <IconPlay size={36} />
      </button>
    );

  return (
    <div className="flex flex-col gap-4">
      <div
        className="card flex min-h-[320px] flex-col items-center justify-center gap-4 p-6 text-center"
        style={{ transform: dx ? `translateX(${dx}px) rotate(${dx / 30}deg)` : undefined, transition: dx ? 'none' : 'transform var(--m-base-d) var(--ease)', touchAction: flipped ? 'pan-y' : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-deck-card={word.id}
      >
        {!flipped ? (
          <>
            {front}
            <button type="button" className="btn btn-ghost" onClick={() => setFlipped(true)}>
              {t('deck.flip')}
            </button>
          </>
        ) : (
          <div className="fade-in flex w-full flex-col items-center gap-3" data-back>
            <div className="flex items-center gap-3">
              <ZhText className="text-zh-glyph font-medium leading-none">{word.zh}</ZhText>
              <PlayButton text={word.zh} onPlay={() => void play(word.zh)} />
            </div>
            <Pinyin text={word.py} tones={tones} className="text-h2" />
            <p lang={word.meanLang} className="id-text text-body">
              {word.mean}
            </p>
            <p className="flex flex-wrap justify-center gap-2">
              {word.mw && (
                <ZhText face="ui" className="label rounded-sm bg-accent-soft px-2 py-[2px] text-accent">
                  {`一${word.mw}`}
                </ZhText>
              )}
              <span className="label rounded-sm bg-paper-2 px-2 py-[2px] text-muted">HSK {word.hsk.replace('-', '–')}</span>
              {word.trad && word.trad !== word.zh && (
                <span className="label rounded-sm bg-paper-2 px-2 py-[2px] text-muted">
                  {t('words.trad')} <ZhText face="ui">{word.trad}</ZhText>
                </span>
              )}
            </p>
            {word.ex && (
              <div className="w-full rounded-md bg-paper-2 p-3 text-start">
                <ZhTextOverride showPinyin toneColours={tones}>
                  <ZhSentence zh={word.ex.zh} py={word.ex.py} id={word.ex.id} size="body" wordSheet={false} />
                </ZhTextOverride>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {hanChars(word.zh).map((ch, i) => (
                <button key={`${ch}${i}`} type="button" className="btn btn-quiet min-h-touch px-3" aria-expanded={strokes === ch} onClick={() => setStrokes(strokes === ch ? null : ch)}>
                  {t('strokes.see', { ch })}
                </button>
              ))}
            </div>
            {strokes && <StrokeOrder char={strokes} size={180} autoplay lang={lang} />}
          </div>
        )}
      </div>
      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => onGrade(false)}>
            {t('deck.again')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onGrade(true)}>
            {t('deck.know')}
          </button>
        </div>
      )}
    </div>
  );
}
