'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Rung } from '@/lib/types';

/** What the tap-a-word sheet shows for a word (DESIGN §6.4). */
export type WordInfo = {
  zh: string;
  py: string;
  id: string;
  en?: string;
  /** Measure word for a noun (一本书 → 本). */
  mw?: string;
  hsk?: string;
  trad?: string;
};

export type PinyinMode = Rung['pinyin'];

export type ZhTextState = {
  /** The rung's pinyin fade (PRD §4.5). */
  pinyin: PinyinMode;
  /** The lesson's Pinyin toggle: show all pinyin. */
  pinyinOn: boolean;
  /** Tone colours on (setting or rung default, or the lesson's Nada toggle). */
  toneColours: boolean;
  /** Words introduced in this lesson or the previous two: pinyin stays visible over them in "new". */
  recentWords: ReadonlySet<string>;
  /** P is held: show all pinyin while held (on-request and new). */
  revealHeld: boolean;
  /** Word information for the tap-a-word sheet. */
  words: ReadonlyMap<string, WordInfo>;
};

const DEFAULT: ZhTextState = {
  pinyin: 'always',
  pinyinOn: false,
  toneColours: true,
  recentWords: new Set(),
  revealHeld: false,
  words: new Map(),
};

const Ctx = createContext<ZhTextState>(DEFAULT);

export function useZhText(): ZhTextState {
  return useContext(Ctx);
}

/** Whether a word's pinyin shows under the current fade. */
export function pinyinVisible(s: ZhTextState, word: string, heldWord = false): boolean {
  switch (s.pinyin) {
    case 'always':
      return true;
    case 'new':
      return s.pinyinOn || s.revealHeld || heldWord || s.recentWords.has(word);
    case 'on-request':
      return s.pinyinOn || s.revealHeld || heldWord;
    case 'off':
      return false;
  }
}

type Props = {
  pinyin?: PinyinMode;
  pinyinOn?: boolean;
  toneColours?: boolean;
  recentWords?: string[];
  words?: WordInfo[];
  children: React.ReactNode;
};

/**
 * Lesson-scoped Chinese text settings (CLAUDE.md §7.2). Holding P shows all pinyin while held when
 * the rung fades it. Nothing here is saved: it resets when the lesson closes.
 */
export function ZhTextProvider({ pinyin = 'always', pinyinOn = false, toneColours = true, recentWords, words, children }: Props) {
  const [pKey, setPKey] = useState(false);
  useEffect(() => {
    if (pinyin === 'always' || pinyin === 'off') return;
    const typing = () => {
      const el = document.activeElement as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    };
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'p' || e.key === 'P') && !e.altKey && !e.ctrlKey && !e.metaKey && !typing()) setPKey(true);
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') setPKey(false);
    };
    const blur = () => setPKey(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [pinyin]);
  const recent = useMemo(() => new Set(recentWords ?? []), [recentWords]);
  const map = useMemo(() => new Map((words ?? []).map((w) => [w.zh, w])), [words]);
  return (
    <Ctx.Provider value={{ pinyin, pinyinOn, toneColours, recentWords: recent, revealHeld: pKey, words: map }}>
      {children}
    </Ctx.Provider>
  );
}

/**
 * Overrides inside a provider: a reading test hides pinyin (show: false), the deck shows it (true).
 */
export function ZhTextOverride({ showPinyin, toneColours, children }: { showPinyin?: boolean; toneColours?: boolean; children: React.ReactNode }) {
  const s = useZhText();
  const value: ZhTextState = {
    ...s,
    ...(showPinyin === undefined ? {} : { pinyin: showPinyin ? 'always' : 'off' }),
    ...(toneColours === undefined ? {} : { toneColours }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
