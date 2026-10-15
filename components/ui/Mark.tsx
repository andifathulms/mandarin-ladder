import { ZhText } from '../zh/ZhText';

/** Two rails and three rungs drawn as one shape; the top rung in --rung gold. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable={false}>
      <path d="M9 3v26M23 3v26M9 22h14M9 15h14" stroke="var(--board)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M9 8h14" stroke="var(--rung)" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The mark in a cream disc, the name in the serif, and a mono line "DASAR → HSK 9" with 阶梯
 * (jiētī, ladder) in the hanzi face, its pinyin as tiny ruby (DESIGN §2).
 */
export function Wordmark({ onBoard = false }: { onBoard?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-board-ink shadow-e1">
        <Mark size={22} />
      </span>
      <span className="flex flex-col gap-[3px]">
        <span className={`font-display text-wordmark font-semibold leading-none ${onBoard ? 'text-board-ink' : 'text-ink'}`}>Mandarin Ladder</span>
        <span className={`flex items-end gap-2 leading-none ${onBoard ? 'text-board-muted' : 'text-muted'}`}>
          <span className="label">DASAR → HSK 9</span>
          <ZhText className="wordmark-ruby text-[1rem] leading-none" title="jiētī: tangga">
            <ruby>
              阶梯<rt lang="zh-Latn-pinyin">jiētī</rt>
            </ruby>
          </ZhText>
        </span>
      </span>
    </span>
  );
}
