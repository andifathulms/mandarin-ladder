'use client';

import { useEffect, useRef } from 'react';

export const HOLD_MS = 350;

type Props = {
  enabled: boolean;
  onHeld: (held: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

/** Press and hold (350ms) to show full harakat while held. Keyboard users have H and the Harakat pill. */
export function HoldReveal({ enabled, onHeld, children, className = '' }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => clear, []);
  if (!enabled) return <div className={className}>{children}</div>;
  const release = () => {
    clear();
    onHeld(false);
  };
  return (
    <div
      className={`select-none ${className}`}
      onPointerDown={() => {
        clear();
        timer.current = setTimeout(() => onHeld(true), HOLD_MS);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
      data-hold
    >
      {children}
    </div>
  );
}
