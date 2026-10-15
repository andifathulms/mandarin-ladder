import type { Rung } from '@/lib/types';

export function TierDot({ tier }: { tier: Rung['tier'] }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[10px] w-[10px] shrink-0 rounded-full"
      style={{ background: `var(--${tier})` }}
    />
  );
}
