'use client';

import { useRoving } from '../visuals/useRoving';

type Props<T> = { label: string; value: T; options: { value: NoInfer<T>; label: string; lang?: string }[]; onChange: (v: T) => void };

export function Segmented<T>({ label, value, options, onChange }: Props<T>) {
  const roving = useRoving(
    options.map((o) => o.value),
    value,
    onChange,
  );
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={roving.onKeyDown} className="inline-flex max-w-full flex-wrap gap-1 self-start rounded-lg border border-rule bg-surface p-1">
      {options.map((o, i) => (
        <button
          key={String(o.value)}
          type="button"
          lang={o.lang}
          {...roving.itemProps(o.value, i)}
          className="min-h-touch rounded-full px-4 text-small font-bold transition-colors duration-quick"
          style={
            o.value === value
              ? { background: 'var(--accent)', color: 'var(--accent-ink)' }
              : { background: 'transparent', color: 'var(--ink)' }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
