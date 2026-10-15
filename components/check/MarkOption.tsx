'use client';

import { MARK_CHAR, MARK_LABEL, type MarkName } from '@/lib/arabic/marks';
import { ArIsland } from '../ar/ArIsland';
import { IconCheck, IconClose } from '../ui/Icon';
import type { PillState } from './OptionPill';

const styles: Record<PillState, React.CSSProperties> = {
  idle: { background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--rule)' },
  selected: { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' },
  correct: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  answer: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  wrong: { background: 'var(--off-bg)', color: 'var(--off)', borderColor: 'var(--off-bg)' },
};

type Props = { mark: MarkName; state: PillState; index: number; disabled?: boolean; onClick: () => void };

/** A harakat option: the mark on a dotted circle in Amiri, with its Latin name beneath (DESIGN §6.7). */
export function MarkOption({ mark, state, index, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === 'selected' || state === 'correct' ? true : undefined}
      aria-keyshortcuts={index < 4 ? String(index + 1) : undefined}
      aria-label={MARK_LABEL[mark]}
      data-state={state}
      data-mark={mark}
      className={`flex min-h-[88px] min-w-[84px] flex-col items-center justify-center gap-1 rounded-md border-2 px-3 py-2 transition-colors duration-quick ${
        state === 'idle' && !disabled ? 'hover:border-accent' : ''
      }`}
      style={styles[state]}
    >
      <ArIsland face="display" aria-hidden className="text-[2.6rem] leading-[1.25]">
        {`◌${MARK_CHAR[mark]}`}
      </ArIsland>
      <span className="flex items-center gap-1 text-small font-bold" lang="ar-Latn">
        {(state === 'correct' || state === 'answer') && <IconCheck size={14} draw />}
        {state === 'wrong' && <IconClose size={14} />}
        <span className={state === 'wrong' ? 'line-through' : undefined}>{MARK_LABEL[mark]}</span>
      </span>
    </button>
  );
}
