'use client';

import { useLayoutEffect, useRef } from 'react';
import { letterLabel } from '@/lib/arabic/names';
import { ArIsland } from '../ar/ArIsland';
import { useReducedMotion, useT } from '../ProgressProvider';

type Props = {
  tiles: string[];
  /** Indices into tiles, in answer order (first = the first letter or word read, on the right). */
  placed: number[];
  onChange: (placed: number[]) => void;
  /** spell: isolated letters joining into one word; order: whole Arabic words flowing right to left. */
  mode: 'spell' | 'order';
  /** Letters the answer needs, for the slot dots (spell mode). */
  slots?: number;
  locked?: boolean;
  tone?: 'idle' | 'good' | 'off';
};

const toneStyle = (tone: Props['tone']) =>
  tone === 'good'
    ? { background: 'var(--good-bg)', borderColor: 'var(--good)', color: 'var(--good)' }
    : tone === 'off'
      ? { borderColor: 'var(--off)' }
      : {};

/**
 * Arabic tiles (DESIGN §6.7). In spell mode the answer line is a single RTL island holding the placed
 * letters as one joined string, never separate spans, so the learner watches ك become كت, كتا, كتاب.
 * Tapping the answer line removes the last letter. In order mode tiles are whole words and the
 * answer line flows right to left.
 */
export function ArTileTray({ tiles, placed, onChange, mode, slots, locked, tone = 'idle' }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const els = useRef(new Map<number, HTMLButtonElement>());
  const before = useRef(new Map<number, DOMRect>());

  const snapshot = () => {
    before.current.clear();
    els.current.forEach((el, i) => before.current.set(i, el.getBoundingClientRect()));
  };

  // FLIP for tiles that move between tray and line (order mode).
  useLayoutEffect(() => {
    if (reduced || before.current.size === 0) return;
    els.current.forEach((el, i) => {
      const old = before.current.get(i);
      if (!old) return;
      const now = el.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (!dx && !dy) return;
      el.style.transition = 'none';
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      requestAnimationFrame(() => {
        el.style.transition = 'transform var(--m-object-d) var(--ease-object)';
        el.style.transform = '';
      });
    });
    before.current.clear();
  }, [placed, reduced]);

  const toggle = (i: number) => {
    if (locked) return;
    snapshot();
    onChange(placed.includes(i) ? placed.filter((x) => x !== i) : [...placed, i]);
  };
  const removeLast = () => {
    if (locked || !placed.length) return;
    onChange(placed.slice(0, -1));
  };

  const tile = (i: number, inLine: boolean) => (
    <button
      key={i}
      ref={(el) => {
        if (el) els.current.set(i, el);
        else els.current.delete(i);
      }}
      type="button"
      onClick={() => toggle(i)}
      disabled={locked}
      aria-label={mode === 'spell' ? letterLabel(tiles[i]) : undefined}
      data-tile={tiles[i]}
      className={`flex items-center justify-center rounded-sm border-2 border-rule bg-surface text-ink ${
        mode === 'spell' ? 'h-[52px] w-[52px]' : 'min-h-pill min-w-touch px-4'
      }`}
      style={inLine ? toneStyle(tone) : undefined}
    >
      <ArIsland size="body" className="leading-none">
        {tiles[i]}
      </ArIsland>
    </button>
  );

  const tray = tiles.map((_, i) => i).filter((i) => !placed.includes(i));
  const word = placed.map((i) => tiles[i]).join('');
  const left = Math.max(0, (slots ?? tiles.length) - placed.length);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted">{mode === 'spell' ? t('check.tapLetters') : t('check.tapTiles')}</p>
      {mode === 'spell' ? (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={removeLast}
            disabled={locked || !placed.length}
            aria-label={t('check.spellLine', { word: word || '—' })}
            className="flex min-h-[76px] items-center justify-start rounded-sm border-b-2 border-rule px-2 text-start"
            style={toneStyle(tone)}
            data-answer-line
          >
            <ArIsland block size="sentence" className="w-full text-ink fade-in" key={reduced ? 'w' : word}>
              {word || ' '}
            </ArIsland>
          </button>
          <div aria-hidden dir="rtl" className="flex gap-[6px] px-2">
            {Array.from({ length: left }, (_, k) => (
              <span key={k} className="h-[6px] w-[6px] rounded-full bg-rule" />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {word}
          </p>
        </div>
      ) : (
        <div
          aria-label={t('check.answerLine')}
          role="group"
          dir="rtl"
          className="flex min-h-[64px] flex-wrap items-center gap-2 border-b-2 border-rule pb-2"
        >
          {placed.map((i) => tile(i, true))}
        </div>
      )}
      <div aria-label={mode === 'spell' ? t('check.letterTray') : t('check.tray')} role="group" dir="rtl" className="flex min-h-[52px] flex-wrap gap-2">
        {tray.map((i) => tile(i, false))}
      </div>
    </div>
  );
}
