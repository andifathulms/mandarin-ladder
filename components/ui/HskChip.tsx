import { hskLabel } from './tier';

/** "HSK 1" in mono (DESIGN §6.3): muted on paper, brass on the board. Nothing for the Dasar rungs. */
export function HskChip({ hsk, onBoard = false, className = '' }: { hsk: string; onBoard?: boolean; className?: string }) {
  const label = hskLabel(hsk);
  if (!label) return null;
  return <span className={`label tnum whitespace-nowrap ${onBoard ? 'text-brass' : 'text-muted'} ${className}`}>{label}</span>;
}
