'use client';

import type { Rung } from '@/lib/types';
import { ArIsland } from '../ar/ArIsland';
import { useT } from '../ProgressProvider';

type Props = {
  translit: Rung['translit'];
  harakat: Rung['harakat'];
  latinOn: boolean;
  harakatOn: boolean;
  onLatin: (v: boolean) => void;
  onHarakat: (v: boolean) => void;
};

function Pill({ on, onClick, label, children }: { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-[32px] items-center gap-1 rounded-full px-3 text-small font-bold transition-colors duration-quick ${
        on ? 'bg-accent-soft text-accent' : 'bg-paper-2 text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Latin and Harakat switches for the lesson top bar (DESIGN §6.5). Each appears only when the rung
 * thins that support out, and both are lesson-scoped: they live in LessonPlayer state, never in
 * settings, so they reset when the lesson closes (fixes English Ladder issue 5).
 */
export function LessonTopToggles({ translit, harakat, latinOn, harakatOn, onLatin, onHarakat }: Props) {
  const { t } = useT();
  const showLatin = translit === 'on-request';
  const showHarakat = harakat !== 'full';
  if (!showLatin && !showHarakat) return null;
  return (
    <div role="group" aria-label={t('toggle.group')} className="flex shrink-0 items-center gap-1">
      {showLatin && (
        <Pill on={latinOn} onClick={() => onLatin(!latinOn)} label={t('toggle.latinLong')}>
          {t('toggle.latin')}
        </Pill>
      )}
      {showHarakat && (
        <Pill on={harakatOn} onClick={() => onHarakat(!harakatOn)} label={t('toggle.harakatLong')}>
          <ArIsland face="ui" aria-hidden className="text-[1.1rem] leading-none">
            {'◌َ'}
          </ArIsland>
          {t('toggle.harakat')}
        </Pill>
      )}
    </div>
  );
}
