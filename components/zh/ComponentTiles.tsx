'use client';

import type { HanziCard } from '@/lib/types';
import { ZhText } from './ZhText';
import { useT } from '../ProgressProvider';

type Props = {
  parts: string[];
  chosen: string[];
  onChange: (chosen: string[]) => void;
  /** How many parts the answer needs. */
  need: number;
  /** The target character, shown when solved (or as the answer box's reveal). */
  char: string;
  solved?: boolean;
  locked?: boolean;
  tone?: 'idle' | 'good' | 'off';
  /** Parts with meanings, from the build page's data, for labels. */
  info?: HanziCard;
};

/**
 * build items (DESIGN §6.7): component tiles in WenKai and an answer box that assembles the character
 * as parts are chosen (CharacterParts in reverse).
 */
export function ComponentTiles({ parts, chosen, onChange, need, char, solved, locked, tone = 'idle' }: Props) {
  const { t } = useT();
  const toggle = (p: string) => {
    if (locked) return;
    onChange(chosen.includes(p) ? chosen.filter((x) => x !== p) : chosen.length < need ? [...chosen, p] : chosen);
  };
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex min-h-[96px] items-center gap-3 rounded-md border-2 border-dashed px-4"
        style={{ borderColor: tone === 'good' ? 'var(--good)' : tone === 'off' ? 'var(--off)' : 'var(--rule)' }}
        aria-live="polite"
        role="group"
        aria-label={t('check.buildBox')}
      >
        {chosen.map((p, i) => (
          <span key={p} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="text-h2 text-muted">+</span>}
            <ZhText className="text-zh-sentence">{p}</ZhText>
          </span>
        ))}
        {solved && (
          <span className="flex items-center gap-3">
            <span aria-hidden className="text-h2 text-muted">=</span>
            <ZhText className="tianzige flex h-[64px] w-[64px] items-center justify-center rounded-sm bg-paper-2 text-[2.6rem] leading-none text-good">
              {char}
            </ZhText>
          </span>
        )}
        {!chosen.length && <span className="text-small text-muted">{t('check.buildEmpty', { n: need })}</span>}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('check.buildParts')}>
        {parts.map((p) => {
          const on = chosen.includes(p);
          return (
            <button
              key={p}
              type="button"
              disabled={locked}
              onClick={() => toggle(p)}
              aria-pressed={on}
              data-part={p}
              className="flex h-[60px] min-w-[60px] items-center justify-center rounded-sm border-2 px-3 transition-colors duration-quick"
              style={{
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
                borderColor: on ? 'var(--accent)' : 'var(--rule)',
              }}
            >
              <ZhText className="text-zh-body leading-none">{p}</ZhText>
            </button>
          );
        })}
      </div>
    </div>
  );
}
