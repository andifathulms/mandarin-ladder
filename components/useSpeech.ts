'use client';

import { useCallback, useEffect, useState } from 'react';
import { onVoicesChanged } from '@/lib/speech/speak';
import { canPlay, loadManifest, onManifest, play, type Variety } from '@/lib/speech/audio';
import { useSettings } from './ProgressProvider';

/** Whether this string can be played (recording or Arabic voice), updated as voices and the manifest load. */
export function useCanPlay(text: string, variety: Variety = 'fusha'): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(canPlay(text, variety));
    check();
    void loadManifest().then(check);
    const offV = onVoicesChanged(check);
    const offM = onManifest(check);
    return () => {
      offV();
      offM();
    };
  }, [text, variety]);
  return ok;
}

/** Plays Arabic with the learner's pace and voice settings. */
export function usePlay() {
  const { voice, rate } = useSettings();
  return useCallback(
    (text: string, variety: Variety = 'fusha', onWord?: (i: number) => void) => play(text, { variety, rate, gender: voice, onWord }),
    [voice, rate],
  );
}
