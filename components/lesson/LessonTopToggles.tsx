'use client';

import type { Rung } from '@/lib/types';
import { useT } from '../ProgressProvider';

type Props = {
  pinyin: Rung['pinyin'];
  pinyinOn: boolean;
  toneOn: boolean;
  onPinyin: (v: boolean) => void;
  onTone: (v: boolean) => void;
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

/** Four tiny dots in the tone colours, the Nada pill's mark. */
function ToneDots() {
  return (
    <span aria-hidden className="grid grid-cols-2 gap-[2px]">
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="h-[5px] w-[5px] rounded-full" style={{ background: `var(--tone-${n})` }} />
      ))}
    </span>
  );
}

/**
 * Pinyin and Nada (tone colours) switches for the lesson top bar (DESIGN §6.5). Pinyin appears only
 * when the rung fades it (new or on-request); Nada is always there. Both are lesson-scoped: they live
 * in LessonPlayer state, never in settings, so they reset when the lesson closes.
 */
export function LessonTopToggles({ pinyin, pinyinOn, toneOn, onPinyin, onTone }: Props) {
  const { t } = useT();
  const showPinyin = pinyin === 'new' || pinyin === 'on-request';
  return (
    <div role="group" aria-label={t('toggle.group')} className="flex shrink-0 items-center gap-1">
      {showPinyin && (
        <Pill on={pinyinOn} onClick={() => onPinyin(!pinyinOn)} label={t('toggle.pinyinLong')}>
          {t('toggle.pinyin')}
        </Pill>
      )}
      <Pill on={toneOn} onClick={() => onTone(!toneOn)} label={t('toggle.toneLong')}>
        <ToneDots />
        {t('toggle.tone')}
      </Pill>
    </div>
  );
}
