'use client';

import { Fragment, useMemo, useRef, useState } from 'react';
import type { Bilingual } from '@/lib/types';
import { tryAlign, type AlignedWord } from '@/lib/zh/align';
import { joinZh } from '@/lib/zh/text';
import { pyDisplay } from './Pinyin';
import { RubyWord } from './Ruby';
import { pinyinVisible, useZhText, type WordInfo } from './ZhContext';
import { WordSheet } from './WordSheet';
import { PlayButton } from '../lesson/PlayButton';
import { Prose } from '../lesson/Prose';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';

export type ZhSize = 'sentence' | 'body' | 'small' | 'glyph';

type Props = {
  /** Authored Chinese: words separated by spaces, [[focus]] marks (CLAUDE.md §5.2). */
  zh: string;
  /** Authored pinyin, token for token. */
  py: string;
  id?: string;
  en?: string;
  size?: ZhSize;
  play?: boolean;
  /** Note revealed by tapping the focus word. */
  note?: Bilingual | true;
  /** The "terdengar aneh" side of a pair: raspberry with strikethrough, no audio. */
  off?: boolean;
  /** Override the fade: reading items pass false, the deck passes true. */
  showPinyin?: boolean;
  /** Tap a word for its sheet (default: when the word is known). */
  wordSheet?: boolean;
  /** Spoken tones per syllable (Nada card): colours follow them instead of the written tones. */
  spoken?: number[];
  className?: string;
};

const SIZE: Record<ZhSize, string> = {
  sentence: 'text-zh-sentence font-medium',
  body: 'text-zh-body',
  small: 'text-zh-small',
  glyph: 'text-zh-glyph font-medium',
};

const HOLD_MS = 350;

/** Character offsets of each word in the joined text, for mapping speech boundaries to words. */
function offsets(words: AlignedWord[]): { start: number; end: number }[] {
  let pos = 0;
  return words.map((w, i) => {
    const prev = words[i - 1];
    if (prev && prev.kind === 'latin' && w.kind === 'latin') pos += 1;
    const start = pos;
    pos += w.text.length;
    return { start, end: pos };
  });
}

/**
 * The Chinese sentence block (DESIGN §6.4): hanzi in WenKai with pinyin ruby above (per the fade),
 * tone colours if on, the translation below, and a play button. Words break only between words;
 * the focus is an underline, never bold. Screen readers get the hanzi, then the pinyin in brackets.
 */
export function ZhSentence({ zh, py, id, en, size = 'sentence', play = true, note, off, showPinyin, wordSheet, spoken, className = '' }: Props) {
  const { t, lang } = useT();
  const ctx = useZhText();
  const playText = usePlay();
  const words = useMemo(() => tryAlign(zh, py), [zh, py]);
  const plain = useMemo(() => (words ? joinZh(words) : zh.replace(/\[\[|\]\]/g, '').replace(/\s+/g, '')), [words, zh]);
  const [spokenIdx, setSpokenIdx] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [sheet, setSheet] = useState<WordInfo | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translation = lang === 'en' ? (en ?? id) : id;
  const noteText = note === true ? t('lesson.focusNote') : note ? (lang === 'en' ? note.en : note.id) : null;

  if (!words) {
    // Content checks make this unreachable; fail visibly but readably.
    return (
      <p lang="zh-Hans" className={`zh font-zh ${SIZE[size]} ${className}`} data-align-error>
        {plain}
      </p>
    );
  }

  const offs = offsets(words);
  const onPlay = async () => {
    setPlaying(true);
    // Recordings count words (punctuation aside); speech reports character offsets in the joined text.
    const wordIdx = words.map((w, i) => (w.kind === 'punct' ? -1 : i)).filter((i) => i >= 0);
    await playText(plain, {
      onWord: (k) => setSpokenIdx(wordIdx[k] ?? null),
      onChar: (charIndex) => {
        const k = offs.findIndex((o) => charIndex >= o.start && charIndex < o.end);
        if (k >= 0) setSpokenIdx(k);
      },
    });
    setPlaying(false);
    setSpokenIdx(null);
  };

  const canHold = ctx.pinyin === 'new' || ctx.pinyin === 'on-request';
  const anyVisible = (w: AlignedWord, i: number) => (showPinyin ?? pinyinVisible(ctx, w.text, held === i));
  const tonesOn = ctx.toneColours && !off;
  // Spoken tones are given per syllable for the whole line; slice them per word.
  let sylAt = 0;
  const spokenFor = (w: AlignedWord) => {
    const s = spoken?.slice(sylAt, sylAt + w.chars.length);
    sylAt += w.chars.length;
    return s;
  };

  const srPinyin = words.every((w, i) => w.kind !== 'han' || anyVisible(w, i))
    ? words
        .map((w) => w.py)
        .join(' ')
        .replace(/\s+([,.!?;:])/g, '$1')
    : null;

  const line = (
    <p
      className={`zh-line zh font-zh ${SIZE[size]} ${off ? 'off-text' : 'text-ink'} ${size === 'glyph' ? 'text-center' : ''} min-w-0`}
      lang="zh-Hans"
    >
      {words.map((w, i) => {
        const info = w.kind === 'han' ? ctx.words.get(w.text) : undefined;
        const visible = anyVisible(w, i);
        const active = spokenIdx === i;
        const focus = w.focus && !off;
        const cls = [
          focus ? (tonesOn ? 'zh-focus zh-focus-tones' : 'zh-focus') : '',
          active ? 'zh-speaking' : '',
        ]
          .filter(Boolean)
          .join(' ');
        const ruby = <RubyWord word={w} showPinyin={visible} toneColours={tonesOn} spokenTones={spokenFor(w)} />;
        const holdProps = canHold
          ? {
              onPointerDown: () => {
                if (timer.current) clearTimeout(timer.current);
                timer.current = setTimeout(() => setHeld(i), HOLD_MS);
              },
              onPointerUp: () => {
                if (timer.current) clearTimeout(timer.current);
                setHeld(null);
              },
              onPointerLeave: () => {
                if (timer.current) clearTimeout(timer.current);
                setHeld(null);
              },
              onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
            }
          : {};
        const sep = i > 0 && w.kind !== 'punct' ? <wbr /> : null;
        if (focus && noteText) {
          return (
            <Fragment key={i}>
              {sep}
              <button type="button" onClick={() => setShowNote((v) => !v)} aria-expanded={showNote} aria-label={w.text} className={`zh-word ${cls}`} {...holdProps}>
                {ruby}
              </button>
            </Fragment>
          );
        }
        if (info && wordSheet !== false && !off) {
          return (
            <Fragment key={i}>
              {sep}
              <button
                type="button"
                className={`zh-word zh-tap ${cls}`}
                aria-label={w.text}
                onClick={() => setSheet(info)}
                aria-haspopup="dialog"
                {...holdProps}
              >
                {ruby}
              </button>
            </Fragment>
          );
        }
        return (
          <Fragment key={i}>
            {sep}
            <span className={`zh-word ${cls}`} {...holdProps}>
              {ruby}
            </span>
          </Fragment>
        );
      })}
      {srPinyin && (
        <span className="sr-only" lang="zh-Latn-pinyin">
          {' '}({pyDisplay(srPinyin)})
        </span>
      )}
    </p>
  );

  return (
    <div className={`flex flex-col ${className}`} data-zh-sentence>
      <div className={`flex items-start gap-2 ${size === 'glyph' ? 'justify-center' : ''}`}>
        <div className={size === 'glyph' ? 'tianzige rounded-md bg-paper-2 px-6' : 'min-w-0 flex-1'}>{line}</div>
        {play && !off && size !== 'glyph' && (
          <span className={size === 'sentence' ? 'mt-5' : 'mt-3'}>
            <PlayButton text={plain} onPlay={onPlay} playing={playing} small={size !== 'sentence'} />
          </span>
        )}
      </div>
      {translation && (
        <p lang={lang === 'en' && en ? 'en' : 'id'} className="id-text">
          {translation}
        </p>
      )}
      {showNote && noteText && (
        <div className="fade-in mt-2 self-start rounded-sm bg-accent-soft px-3 py-1 text-small text-ink" role="note">
          <Prose text={noteText} lang={lang} />
        </div>
      )}
      {sheet && <WordSheet word={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}
