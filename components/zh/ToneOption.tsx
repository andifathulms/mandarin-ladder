'use client';

import { ToneContourMini } from '../visuals/ToneContourMini';
import { IconCheck, IconClose } from '../ui/Icon';
import { pillStyles, type PillState } from '../check/OptionPill';
import { useT } from '../ProgressProvider';

type Props = { tones: number[]; state: PillState; index: number; disabled?: boolean; onClick: () => void };

/** "3 + 3": neutral is shown as a dot. */
export const toneLabel = (tones: number[]) => tones.map((n) => (n === 0 ? '·' : String(n))).join(' + ');

/**
 * A tone-sequence option (DESIGN §6.7): small contour glyphs with their numbers, so colour is never
 * the only signal.
 */
export function ToneOption({ tones, state, index, disabled, onClick }: Props) {
  const { t } = useT();
  const label = toneLabel(tones);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === 'selected' || state === 'correct' ? true : undefined}
      aria-keyshortcuts={index < 4 ? String(index + 1) : undefined}
      aria-label={t('check.toneOption', { tones: tones.map((n) => (n === 0 ? t('tone.neutral') : n)).join(', ') })}
      data-state={state}
      data-tones={tones.join(',')}
      className={`flex min-h-[88px] min-w-[120px] flex-col items-center justify-center gap-1 rounded-md border-2 px-3 py-2 transition-colors duration-quick ${
        state === 'idle' && !disabled ? 'hover:border-accent' : ''
      }`}
      style={pillStyles[state]}
    >
      <ToneContourMini tones={tones} width={Math.max(64, 32 * tones.length + 12)} height={40} colours={state === 'idle' || state === 'selected'} />
      <span className="flex items-center gap-1 font-mono text-body font-medium tnum">
        {(state === 'correct' || state === 'answer') && <IconCheck size={14} draw />}
        {state === 'wrong' && <IconClose size={14} />}
        <span className={state === 'wrong' ? 'line-through' : undefined}>{label}</span>
      </span>
    </button>
  );
}
