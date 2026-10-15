'use client';

import { parseInline } from '@/lib/markup';
import { hasArabic } from '@/lib/arabic/text';
import { ArIsland } from '../ar/ArIsland';
import { IconCheck, IconClose } from '../ui/Icon';

export type PillState = 'idle' | 'correct' | 'wrong' | 'selected' | 'answer';

type Props = {
  label: string;
  state: PillState;
  index: number;
  disabled?: boolean;
  onClick: () => void;
  wide?: boolean;
  /** Show the 1–4 number-key badge (Arabic options). */
  badge?: boolean;
};

const styles: Record<PillState, React.CSSProperties> = {
  idle: { background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--rule)' },
  selected: { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)' },
  correct: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  answer: { background: 'var(--good-bg)', color: 'var(--good)', borderColor: 'var(--good)' },
  wrong: { background: 'var(--off-bg)', color: 'var(--off)', borderColor: 'var(--off-bg)' },
};

/**
 * An answer option. Arabic options are full-width pills with the Arabic right-aligned in an RTL island
 * and the number-key badge on the left; transliteration and Indonesian options are normal LTR pills.
 */
export function OptionPill({ label, state, index, disabled, onClick, wide, badge }: Props) {
  const text = parseInline(label)
    .map((t) => t.v)
    .join('');
  const arabic = hasArabic(text);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === 'selected' || state === 'correct' ? true : undefined}
      aria-keyshortcuts={index < 4 ? String(index + 1) : undefined}
      data-state={state}
      lang={arabic ? undefined : /[āīūḥṣḍṭẓʿʾ]/.test(text) ? 'ar-Latn' : 'id'}
      className={`inline-flex min-h-pill items-center gap-3 border-2 px-5 py-2 text-start font-body text-body font-semibold transition-colors duration-quick ${
        wide ? 'w-full rounded-md' : 'rounded-full'
      } ${state === 'idle' && !disabled ? 'hover:border-accent' : ''}`}
      style={styles[state]}
    >
      {badge && index < 4 && (
        <span aria-hidden className="label flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-sm bg-paper-2 text-muted">
          {index + 1}
        </span>
      )}
      {(state === 'correct' || state === 'answer') && <IconCheck size={18} draw className="shrink-0" />}
      {state === 'wrong' && <IconClose size={16} className="shrink-0" />}
      {arabic ? (
        <ArIsland block size="body" className={`min-w-0 flex-1 font-normal ${state === 'wrong' ? 'line-through decoration-[1.5px]' : ''}`}>
          {text}
        </ArIsland>
      ) : (
        <span className={state === 'wrong' ? 'line-through decoration-[1.5px]' : undefined}>{text}</span>
      )}
    </button>
  );
}
