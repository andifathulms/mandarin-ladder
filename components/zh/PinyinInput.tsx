'use client';

import { useId, useRef } from 'react';
import { numToMarks } from '@/lib/zh/pinyin';
import { pyDisplay } from './Pinyin';
import { useT } from '../ProgressProvider';

type Props = {
  value: string;
  onChange: (v: string) => void;
  /** Enter submits (practice mode). */
  onSubmit?: () => void;
  disabled?: boolean;
  tone?: 'idle' | 'good' | 'off';
  label: string;
};

/** Helper keys (DESIGN §6.7): tone marks as numbers after the syllable, and ü. */
const KEYS: { insert: string; glyph: string; name: string }[] = [
  { insert: '1', glyph: '¯', name: 'nada 1' },
  { insert: '2', glyph: '´', name: 'nada 2' },
  { insert: '3', glyph: 'ˇ', name: 'nada 3' },
  { insert: '4', glyph: '`', name: 'nada 4' },
  { insert: 'ü', glyph: 'ü', name: 'ü' },
];

/**
 * Pinyin typing with tone numbers or marks; a live preview converts numbers to marks as you type
 * (ni3 hao3 → nǐ hǎo). ü can be typed as v or u:. Grading treats both forms as equal.
 */
export function PinyinInput({ value, onChange, onSubmit, disabled, tone = 'idle', label }: Props) {
  const { t } = useT();
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const preview = numToMarks(value.replace(/u:/g, 'ü'));

  const insert = (s: string) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = value.slice(0, start) + s + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + s.length, start + s.length);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small text-muted">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        lang="zh-Latn-pinyin"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="min-h-pill w-full rounded-md border-2 bg-surface px-4 font-body text-h2 text-ink outline-none focus:border-accent"
        style={{ borderColor: tone === 'good' ? 'var(--good)' : tone === 'off' ? 'var(--off)' : 'var(--rule)' }}
        aria-describedby={`${id}-preview`}
        data-pinyin-input
      />
      <p id={`${id}-preview`} className="min-h-[1.6em] text-body" aria-live="polite">
        {value.trim() && (
          <>
            <span className="label me-2 text-muted">{t('check.pinyinPreview')}</span>
            <span lang="zh-Latn-pinyin" className="py text-h2" data-pinyin-preview>
              {pyDisplay(preview)}
            </span>
          </>
        )}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('check.pinyinKeys')}>
        {KEYS.map((k) => (
          <button
            key={k.insert}
            type="button"
            disabled={disabled}
            onClick={() => insert(k.insert)}
            aria-label={k.name}
            className="flex h-[44px] min-w-[44px] items-center justify-center rounded-sm border-2 border-rule bg-surface px-3 font-mono text-h2 text-ink hover:border-accent"
          >
            {k.glyph}
          </button>
        ))}
      </div>
    </div>
  );
}
