'use client';

import { useMemo, useState } from 'react';
import { parseInline } from '@/lib/markup';
import type { Bilingual } from '@/lib/types';
import { useT } from '../ProgressProvider';

type Seg = { text: string; start: number; kind: 'text' | 'focus' | 'strong' | 'em'; group: number };

/** Latin sentences only (Indonesian, transliteration). Arabic goes through ArSentence. */

/** Splits markup into word-level segments carrying their offset in the plain string. */
export function segments(src: string): Seg[] {
  const out: Seg[] = [];
  let pos = 0;
  parseInline(src).forEach((tok, group) => {
    for (const piece of tok.v.split(/(\s+)/)) {
      if (!piece) continue;
      out.push({ text: piece, start: pos, kind: tok.t, group });
      pos += piece.length;
    }
  });
  return out;
}

type Props = {
  en: string;
  id?: string;
  /** Kept for call sites; Latin sentences have no audio in Arabic Ladder. */
  play?: boolean;
  /** Style: the big taught sentence, or inline/body size. */
  size?: 'sentence' | 'body';
  /** Optional note revealed by tapping the focus word. */
  note?: Bilingual | true;
  off?: boolean;
  className?: string;
};

export function Sentence({ en, id, size = 'sentence', note, off, className = '' }: Props) {
  const { t, lang } = useT();
  const segs = useMemo(() => segments(en), [en]);
  const [showNote, setShowNote] = useState(false);

  // Render groups so a multi-word focus stays one underlined span.
  const groups: Seg[][] = [];
  segs.forEach((s) => {
    const last = groups[groups.length - 1];
    if (last && last[0].group === s.group) last.push(s);
    else groups.push([s]);
  });

  const renderSeg = (s: Seg) => {
    const i = segs.indexOf(s);
    return <span key={i}>{s.text}</span>;
  };

  const noteText = note === true ? t('lesson.focusNote') : note ? (lang === 'en' ? note.en : note.id) : null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-start gap-2">
        <p
          lang="en"
          className={`${size === 'sentence' ? 'font-display text-sentence font-medium' : 'text-body'} ${
            off ? 'off-text' : 'text-ink'
          } min-w-0 flex-1`}
        >
          {groups.map((g, gi) => {
            const kind = g[0].kind;
            const inner = g.map(renderSeg);
            if (kind === 'focus') {
              return noteText ? (
                <button
                  key={gi}
                  type="button"
                  onClick={() => setShowNote((v) => !v)}
                  aria-expanded={showNote}
                  className="focus-word -mx-px rounded-sm px-px hover:bg-accent-soft"
                >
                  {inner}
                </button>
              ) : (
                <span key={gi} className={off ? undefined : 'focus-word'}>
                  {inner}
                </span>
              );
            }
            if (kind === 'strong') return <strong key={gi}>{inner}</strong>;
            if (kind === 'em') return <em key={gi}>{inner}</em>;
            return <span key={gi}>{inner}</span>;
          })}
        </p>
      </div>
      {id && (
        <p lang="id" className="id-text">
          {id}
        </p>
      )}
      {showNote && noteText && (
        <p className="fade-in self-start rounded-sm bg-accent-soft px-3 py-1 text-small text-ink" role="note">
          {noteText}
        </p>
      )}
    </div>
  );
}
