'use client';

import { useCallback, useEffect, useState } from 'react';
import { onVoicesChanged } from '@/lib/speech/speak';
import { canPlay, loadManifest, onManifest, play } from '@/lib/speech/audio';
import { useSettings } from './ProgressProvider';

/** Whether this text can be played (recording or a Chinese voice), updated as voices and the manifest load. */
export function useCanPlay(text: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(canPlay(text));
    check();
    void loadManifest().then(check);
    const offV = onVoicesChanged(check);
    const offM = onManifest(check);
    return () => {
      offV();
      offM();
    };
  }, [text]);
  return ok;
}

export type PlayHandlers = { onWord?: (index: number) => void; onChar?: (charIndex: number) => void };

/**
 * Plays Chinese (or a syllable key) with the learner's pace and voice settings. Recordings report word
 * indexes, browser speech character offsets.
 */
export function usePlay() {
  const { voice, rate } = useSettings();
  return useCallback((text: string, h: PlayHandlers = {}) => play(text, { rate, gender: voice, ...h }), [voice, rate]);
}
