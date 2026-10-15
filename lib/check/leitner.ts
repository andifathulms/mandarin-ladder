export type Box = 1 | 2 | 3;

/** A miss sends an item to box 1; a correct answer moves it up one box (max 3). New items start at box 1. */
export function nextBox(prev: Box | undefined, correct: boolean): Box {
  if (!correct) return 1;
  return Math.min((prev ?? 1) + 1, 3) as Box;
}
