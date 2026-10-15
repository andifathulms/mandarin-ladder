'use client';

import { IconPlay } from '../ui/Icon';
import { useT } from '../ProgressProvider';
import { useCanPlay } from '../useSpeech';

type Props = { text: string; onPlay: () => void; playing?: boolean; small?: boolean; label?: string };

/** 44px icon-only play button. Renders nothing when there is no recording and no Chinese voice. */
export function PlayButton({ text, onPlay, playing, small, label }: Props) {
  const { t } = useT();
  const ok = useCanPlay(text);
  if (!ok) return null;
  return (
    <button
      type="button"
      onClick={onPlay}
      data-play
      aria-label={label ?? t('audio.playText', { text })}
      aria-pressed={playing || undefined}
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-accent transition-colors duration-quick hover:bg-accent-soft ${
        small ? 'h-[40px] w-[40px]' : 'h-[44px] w-[44px]'
      } ${playing ? 'bg-accent-soft' : ''}`}
    >
      <IconPlay size={small ? 16 : 18} />
    </button>
  );
}
