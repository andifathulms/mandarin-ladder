/** Inline markup used inside sentences: [[focus]], **bold**, *italic*. Nothing else. */
export type Token =
  | { t: 'text'; v: string }
  | { t: 'focus'; v: string }
  | { t: 'strong'; v: string }
  | { t: 'em'; v: string };

const RE = /\[\[(.+?)\]\]|\*\*(.+?)\*\*|\*(.+?)\*/g;

export function parseInline(src: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of src.matchAll(RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ t: 'text', v: src.slice(last, i) });
    if (m[1] !== undefined) out.push({ t: 'focus', v: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'strong', v: m[2] });
    else out.push({ t: 'em', v: m[3] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ t: 'text', v: src.slice(last) });
  return out;
}

/** Plain text for speech, grading and search. */
export function stripMarkup(src: string): string {
  return parseInline(src)
    .map((t) => t.v)
    .join('');
}

export function focusCount(src: string): number {
  return parseInline(src).filter((t) => t.t === 'focus').length;
}
