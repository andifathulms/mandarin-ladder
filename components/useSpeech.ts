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

/** Plays Chinese with the learner's pace and voice settings. onWord gets character offsets or word indexes. */
export function usePlay() {
  const { voice, rate } = useSettings();
  return useCallback((text: string, onWord?: (i: number) => void) => play(text, { rate, gender: voice, onWord }), [voice, rate]);
}
