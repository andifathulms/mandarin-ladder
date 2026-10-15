// Build-time only.
import { getLetters, getMakhraj } from './load';
import type { VisualDataValue } from '@/components/visuals/VisualData';

export function visualData(): VisualDataValue {
  return { letters: getLetters(), makhraj: getMakhraj() };
}
