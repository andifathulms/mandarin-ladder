'use client';

import { hasHan } from '@/lib/zh/text';
import { ZhInline } from '../zh/ZhInline';
import { IconCheck, IconClose } from '../ui/Icon';

export type PillState = 'idle' | 'correct' | 'wrong' | 'selected' | 'answer';

type Props = {
  label: string;
  state: PillState;
  index: number;
  disabled?: boolean;
  onClick: () => void;
  wide?: boolean;
  /** Show the 1–4 number-key badge. */
  badge?: boolean;
  /** Pinyin for Chinese options (the item's py map). */
  py?: Record<string, string>;
  showPinyin?: boolean;
};

export const pillStyles: Record<PillState, React.CSSProperties> = {
  idle: { background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--rule)' },
  selected: { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' },
  correct: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  answer: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  wrong: { background: 'var(--off-bg)', color: 'var(--off)', borderColor: 'var(--off-bg)' },
};

/**
 * An answer option. Chinese options are full-width pills in WenKai at --t-zh-body, with ruby only when
 * the item allows it (DESIGN §6.7); Indonesian options are normal pills. Wrong is icon + strikethrough.
 */
export function OptionPill({ label, state, index, disabled, onClick, wide, badge, py, showPinyin }: Props) {
  const zh = hasHan(label);
  const strike = state === 'wrong' ? 'line-through decoration-[1.5px]' : '';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === 'selected' || state === 'correct' ? true : undefined}
      aria-keyshortcuts={index < 4 ? String(index + 1) : undefined}
      data-state={state}
      data-option={label}
      lang={zh ? undefined : 'id'}
      className={`inline-flex min-h-pill items-center gap-3 border-2 px-5 py-2 text-start font-body text-body font-semibold transition-colors duration-quick ${
        wide ? 'w-full rounded-md' : 'rounded-full'
      } ${state === 'idle' && !disabled ? 'hover:border-accent' : ''}`}
      style={pillStyles[state]}
    >
      {badge && index < 4 && (
        <span aria-hidden className="label flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-sm bg-paper-2 text-muted">
          {index + 1}
        </span>
      )}
      {(state === 'correct' || state === 'answer') && <IconCheck size={18} draw className="shrink-0" />}
      {state === 'wrong' && <IconClose size={16} className="shrink-0" />}
      {zh ? (
        <ZhInline text={label} py={py} showPinyin={showPinyin} className={`min-w-0 flex-1 text-zh-body font-normal ${strike}`} />
      ) : (
        <span className={strike}>{label.normalize('NFD')}</span>
      )}
    </button>
  );
}
