import { sha1 } from '../speech/sha1';

/**
 * A word's permanent id (CLAUDE.md §5.5): w-<hsk>-<first 8 hex of sha1(zh + py)>. A second sense
 * with the same characters and reading (面¹ 面²) hashes zh + py + "#2". Deck progress is keyed by
 * the id, so it never changes once a word ships.
 */
export function wordId(hsk: string, zh: string, py: string, sense = 1): string {
  const key = zh.normalize('NFC') + py.normalize('NFC') + (sense > 1 ? `#${sense}` : '');
  return `w-${hsk}-${sha1(key).slice(0, 8)}`;
}
