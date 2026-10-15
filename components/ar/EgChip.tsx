/** Marks Egyptian content, so a learner always knows which variety they are reading (DESIGN §4.3). */
export function EgChip({ className = '' }: { className?: string }) {
  return (
    <span
      className={`label inline-flex shrink-0 items-center rounded-sm bg-eg-soft px-[6px] py-px text-eg ${className}`}
      title="ʿAmiyah Mesir"
    >
      EG
    </span>
  );
}
