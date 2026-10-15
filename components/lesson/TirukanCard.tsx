'use client';

import { useEffect, useRef, useState } from 'react';
import { stripMarkup } from '@/lib/markup';
import { audioFor, loadManifest } from '@/lib/speech/audio';
import { ArSentence } from '../ar/ArSentence';
import { IconPlay } from '../ui/Icon';
import { useReducedMotion, useSettings, useT } from '../ProgressProvider';
import { useCanPlay, usePlay } from '../useSpeech';

type Phase = 'idle' | 'first' | 'turn' | 'second';

/** Rough speaking time when there is no recording: about 75ms per character at 1×. */
const estimate = (text: string, rate: number) => (stripMarkup(text).length * 75) / rate;

/**
 * Tirukan (repeat after): plays the sentence, leaves a pause as long as the sentence plus a second
 * for the learner to say it aloud, then plays it again. Nothing is recorded or scored (PRD §5.3).
 */
export function TirukanCard({ ar, tr, id, en }: { ar: string; tr: string; id: string; en?: string }) {
  const { t } = useT();
  const { rate } = useSettings();
  const reduced = useReducedMotion();
  const play = usePlay();
  const can = useCanPlay(ar);
  const [phase, setPhase] = useState<Phase>('idle');
  const [pause, setPause] = useState(0);
  const alive = useRef(true);
  useEffect(
    () => () => {
      alive.current = false;
    },
    [],
  );

  const run = async () => {
    if (phase !== 'idle') return;
    await loadManifest();
    const rec = audioFor(stripMarkup(ar));
    const ms = (rec ? rec.dur / rate : estimate(ar, rate)) + 1000;
    setPhase('first');
    await play(ar);
    if (!alive.current) return;
    setPause(ms);
    setPhase('turn');
    await new Promise((r) => setTimeout(r, ms));
    if (!alive.current) return;
    setPhase('second');
    await play(ar);
    if (alive.current) setPhase('idle');
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-rule p-5" aria-labelledby="tirukan-title">
      <h3 id="tirukan-title" className="eyebrow">
        {t('lesson.tirukan')}
      </h3>
      <ArSentence ar={ar} tr={tr} id={id} en={en} play={false} />
      <div className="flex items-center gap-4">
        {can && (
          <button
            type="button"
            onClick={run}
            disabled={phase !== 'idle'}
            aria-label={t('lesson.tirukanPlay')}
            className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink transition-opacity duration-quick disabled:opacity-60"
          >
            <IconPlay size={24} />
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1" aria-live="polite">
          {phase === 'turn' && (
            <>
              <span className="h-[4px] w-full overflow-hidden rounded-full bg-paper-2">
                <span
                  key={pause}
                  className="block h-full rounded-full bg-accent"
                  style={{
                    width: '100%',
                    transformOrigin: 'left',
                    animation: reduced ? undefined : `tirukan-fill ${pause}ms linear both`,
                  }}
                />
              </span>
              <span className="text-small text-muted">{t('lesson.yourTurn')}</span>
            </>
          )}
        </div>
      </div>
      <p className="text-small text-muted">{t('lesson.tirukanHint')}</p>
    </section>
  );
}
