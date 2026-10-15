'use client';

import { useLayoutEffect, useRef } from 'react';
import { hasHan, joinZh } from '@/lib/zh/text';
import { ZhInline } from '../zh/ZhInline';
import { useReducedMotion, useT } from '../ProgressProvider';

type Props = {
  tiles: string[];
  /** Indices into tiles, in answer-line order. */
  placed: number[];
  onChange: (placed: number[]) => void;
  locked?: boolean;
  tone?: 'idle' | 'good' | 'off';
  py?: Record<string, string>;
  showPinyin?: boolean;
};

/**
 * Word tiles that fly between the tray and the answer line (FLIP, --m-object). Chinese has no spaces,
 * so the answer line also shows the sentence joined (DESIGN §6.7).
 */
export function TileTray({ tiles, placed, onChange, locked, tone = 'idle', py, showPinyin }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const els = useRef(new Map<number, HTMLButtonElement>());
  const before = useRef(new Map<number, DOMRect>());

  const snapshot = () => {
    before.current.clear();
    els.current.forEach((el, i) => before.current.set(i, el.getBoundingClientRect()));
  };

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

  const move = (i: number) => {
    if (locked) return;
    snapshot();
    onChange(placed.includes(i) ? placed.filter((x) => x !== i) : [...placed, i]);
  };

  const zh = tiles.some(hasHan);
  const tile = (i: number, inLine: boolean) => (
    <button
      key={i}
      ref={(el) => {
        if (el) els.current.set(i, el);
        else els.current.delete(i);
      }}
      type="button"
      lang={zh ? undefined : 'id'}
      onClick={() => move(i)}
      disabled={locked}
      data-tile={tiles[i]}
      className={`min-h-pill min-w-touch rounded-sm border-2 px-4 font-body font-semibold ${zh ? 'text-zh-body font-normal' : 'text-body'}`}
      style={{
        background: inLine && tone === 'good' ? 'var(--good-bg)' : 'var(--surface)',
        borderColor: inLine && tone === 'good' ? 'var(--good)' : inLine && tone === 'off' ? 'var(--off)' : 'var(--rule)',
        color: inLine && tone === 'good' ? 'var(--good)' : 'var(--ink)',
      }}
    >
      {zh ? <ZhInline text={tiles[i]} py={py} showPinyin={showPinyin} /> : tiles[i]}
    </button>
  );

  const tray = tiles.map((_, i) => i).filter((i) => !placed.includes(i));
  const joined = joinZh(placed.map((i) => ({ text: tiles[i] })));
  return (
    <div className="flex flex-col gap-4">
      <p className="text-small text-muted">{t('check.tapTiles')}</p>
      <div aria-label={t('check.answerLine')} role="group" className="flex min-h-[64px] flex-wrap items-center gap-2 border-b-2 border-rule pb-2">
        {placed.map((i) => tile(i, true))}
      </div>
      {zh && placed.length > 0 && (
        <p className="text-small text-muted" aria-live="polite">
          <span lang="zh-Hans" className="zh font-zh text-zh-small text-ink">
            {joined}
          </span>
        </p>
      )}
      <div aria-label={t('check.tray')} role="group" className="flex min-h-[52px] flex-wrap gap-2">
        {tray.map((i) => tile(i, false))}
      </div>
    </div>
  );
}
