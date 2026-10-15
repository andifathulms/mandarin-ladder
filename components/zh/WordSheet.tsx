'use client';

import { useEffect, useRef, useState } from 'react';
import { hanChars } from '@/lib/zh/text';
import type { WordInfo } from './ZhContext';
import { Pinyin } from './Pinyin';
import { ZhText } from './ZhText';
import { IconClose } from '../ui/Icon';
import { PlayButton } from '../lesson/PlayButton';
import { usePlay } from '../useSpeech';
import { useSettings, useT } from '../ProgressProvider';
import { StrokeOrder } from '../visuals/StrokeOrder';

const defaultStrokes = (ch: string) => <StrokeOrder char={ch} size={180} autoplay />;

type Props = {
  word: WordInfo;
  onClose: () => void;
  /** Stroke order for one character ("Lihat goresan"); StrokeOrder by default. */
  strokes?: (ch: string) => React.ReactNode;
};

/**
 * The tap-a-word sheet (DESIGN §6.4): the word, its pinyin, its meaning, the measure word for a noun,
 * and stroke order for each character. A modal bottom sheet: Esc and the close button dismiss it.
 */
export function WordSheet({ word, onClose, strokes }: Props) {
  const { t, lang } = useT();
  const play = usePlay();
  const { toneColours } = useSettings();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const back = useRef<HTMLElement | null>(null);

  useEffect(() => {
    back.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      back.current?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[rgb(var(--shadow-rgb)/0.35)]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={word.zh}
        className="sheet-up page flex max-w-lesson flex-col gap-3 rounded-t-xl bg-surface pb-6 pt-4 shadow-e2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <ZhText className="text-zh-sentence font-medium leading-tight">{word.zh}</ZhText>
            <Pinyin text={word.py} tones={toneColours !== false} className="text-body" />
          </div>
          <span className="flex items-center gap-1">
            <PlayButton text={word.zh} onPlay={() => void play(word.zh)} small />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('lesson.close')}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-ink hover:bg-paper-2"
            >
              <IconClose />
            </button>
          </span>
        </div>
        <p lang={lang === 'en' && word.en ? 'en' : 'id'} className="id-text">
          {lang === 'en' ? (word.en ?? word.id) : word.id}
        </p>
        <p className="flex flex-wrap gap-2">
          {word.mw && (
            <span className="label rounded-sm bg-accent-soft px-2 py-[2px] text-accent">
              {t('words.mw')} <ZhText face="ui">{`一${word.mw}`}</ZhText>
            </span>
          )}
          {word.hsk && <span className="label rounded-sm bg-paper-2 px-2 py-[2px] text-muted">HSK {word.hsk.replace('-', '–')}</span>}
          {word.trad && word.trad !== word.zh && (
            <span className="label rounded-sm bg-paper-2 px-2 py-[2px] text-muted">
              {t('words.trad')} <ZhText face="ui">{word.trad}</ZhText>
            </span>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          {hanChars(word.zh).map((ch, i) => (
            <button key={`${ch}${i}`} type="button" className="btn btn-ghost min-h-touch px-3" aria-expanded={open === ch} onClick={() => setOpen(open === ch ? null : ch)}>
              {t('strokes.see', { ch })}
            </button>
          ))}
        </div>
        {open && <div className="fade-in flex justify-center">{(strokes ?? defaultStrokes)(open)}</div>}
      </div>
    </div>
  );
}
