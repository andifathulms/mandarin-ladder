'use client';

import { useMemo, useState } from 'react';
import { stripMarkup } from '@/lib/markup';
import { displayPieces } from '@/lib/arabic/display';
import type { Bilingual } from '@/lib/types';
import { ArIsland, type Variety } from './ArIsland';
import { HoldReveal } from './HoldReveal';
import { Translit } from './Translit';
import { EgChip } from './EgChip';
import { useLessonText } from './LessonText';
import { PlayButton } from '../lesson/PlayButton';
import { Prose } from '../lesson/Prose';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';

type Props = {
  /** Fully vowelled Arabic with optional [[focus]] markup. */
  ar: string;
  tr?: string;
  id?: string;
  en?: string;
  variety?: Variety;
  /** sentence: the taught sentence; body: talk lines, readings, options; glyph: one big letter. */
  size?: 'sentence' | 'body' | 'glyph';
  play?: boolean;
  /** Note revealed by tapping the focus word. */
  note?: Bilingual | true;
  off?: boolean;
  /** Override the lesson's transliteration setting (reading items never show it). */
  showTranslit?: boolean;
  /** Show the EG chip for Egyptian lines (default true). */
  chip?: boolean;
  className?: string;
};

/**
 * The Arabic sentence block (DESIGN §6.4): Arabic right-aligned in an RTL island beside its play
 * button, then transliteration, then the translation. Focus is colour + underline, never bold;
 * the spoken word is highlighted whole.
 */
export function ArSentence({
  ar,
  tr,
  id,
  en,
  variety = 'fusha',
  size = 'sentence',
  play = true,
  note,
  off,
  showTranslit,
  chip = true,
  className = '',
}: Props) {
  const { t, lang } = useT();
  const ctx = useLessonText();
  const playText = usePlay();
  const [held, setHeld] = useState(false);
  const [spoken, setSpoken] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const full = ctx.harakat === 'full' || ctx.revealHeld || held;
  const pieces = useMemo(() => displayPieces(ar, full ? 'full' : ctx.harakat), [ar, full, ctx.harakat]);
  const plain = useMemo(() => stripMarkup(ar), [ar]);
  const translit = showTranslit ?? ctx.showTranslit;
  const translation = lang === 'en' ? (en ?? id) : id;
  const noteText = note === true ? t('lesson.focusNote') : note ? (lang === 'en' ? note.en : note.id) : null;

  const onPlay = async () => {
    setPlaying(true);
    await playText(plain, variety, (i) => setSpoken(i));
    setPlaying(false);
    setSpoken(null);
  };

  const sizeClass = size === 'glyph' ? 'glyph' : size === 'body' ? 'body' : 'sentence';
  const arLine = (
    <ArIsland
      as="p"
      size={sizeClass}
      face={size === 'glyph' ? 'display' : 'text'}
      variety={variety}
      className={`${off ? 'off-text' : 'text-ink'} ${size === 'glyph' ? 'text-center' : ''}`}
      data-harakat={full ? 'full' : ctx.harakat}
    >
      {pieces.map((p, i) => {
        const active = spoken !== null && p.word === spoken;
        const cls = `${p.focus && !off ? 'ar-focus' : ''} ${active ? 'rounded-sm bg-accent-soft transition-colors duration-quick' : ''}`.trim();
        if (p.focus && noteText && !off) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => setShowNote((v) => !v)}
              aria-expanded={showNote}
              className={`inline rounded-sm font-[inherit] hover:bg-accent-soft ${cls}`}
            >
              {p.text}
            </button>
          );
        }
        return (
          <span key={i} className={cls || undefined}>
            {p.text}
          </span>
        );
      })}
    </ArIsland>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-start gap-2">
        {variety === 'eg' && chip && <EgChip className="mt-3" />}
        <HoldReveal enabled={ctx.harakat !== 'full'} onHeld={setHeld} className="min-w-0 flex-1">
          {arLine}
        </HoldReveal>
        {play && !off && (
          <span className={size === 'body' ? 'mt-1' : 'mt-2'}>
            <PlayButton text={plain} variety={variety} onPlay={onPlay} playing={playing} small={size === 'body'} />
          </span>
        )}
      </div>
      {translit && tr && <Translit text={tr} className="mt-1" />}
      {translation && (
        <p lang={lang === 'en' && en ? 'en' : 'id'} className={`id-text ${translit && tr ? 'mt-[2px]' : 'mt-1'}`}>
          {translation}
        </p>
      )}
      {showNote && noteText && (
        <div className="fade-in mt-2 self-start rounded-sm bg-accent-soft px-3 py-1 text-small text-ink" role="note">
          <Prose text={noteText} lang={lang} />
        </div>
      )}
    </div>
  );
}
