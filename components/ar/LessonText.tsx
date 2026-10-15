'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type HarakatLevel = 'full' | 'partial' | 'none';

export type LessonTextState = {
  /** The rung's harakat level. */
  harakat: HarakatLevel;
  /** Show transliteration under Arabic sentences. */
  showTranslit: boolean;
  /** Full harakat right now: the Harakat toggle is on, or H is held. */
  revealHeld: boolean;
};

const DEFAULT: LessonTextState = { harakat: 'full', showTranslit: true, revealHeld: false };
const Ctx = createContext<LessonTextState>(DEFAULT);

export function useLessonText(): LessonTextState {
  return useContext(Ctx);
}

type Props = {
  harakat: HarakatLevel;
  showTranslit: boolean;
  /** The lesson-scoped Harakat toggle: always show full marks. */
  harakatOn?: boolean;
  children: React.ReactNode;
};

/**
 * Lesson-scoped text settings (CLAUDE.md §7.2). Holding H shows full harakat while held when the rung
 * thins them out. Nothing here is saved: it resets when the lesson closes.
 */
export function LessonTextProvider({ harakat, showTranslit, harakatOn = false, children }: Props) {
  const [hKey, setHKey] = useState(false);
  useEffect(() => {
    if (harakat === 'full') return;
    const typing = () => {
      const el = document.activeElement as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'h' || e.key === 'H') && !e.altKey && !e.ctrlKey && !e.metaKey && !typing()) setHKey(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') setHKey(false);
    };
    const blur = () => setHKey(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [harakat]);
  return <Ctx.Provider value={{ harakat, showTranslit, revealHeld: harakatOn || hKey }}>{children}</Ctx.Provider>;
}
