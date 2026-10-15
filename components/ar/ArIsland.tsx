import { createElement } from 'react';

export type ArSize = 'sentence' | 'body' | 'small' | 'glyph' | 'title' | 'inherit';
export type ArFace = 'text' | 'display' | 'ui';
export type Variety = 'fusha' | 'eg';

const SIZE: Record<ArSize, string> = {
  sentence: 'text-ar-sentence font-medium',
  body: 'text-ar-body',
  small: 'text-ar-small',
  glyph: 'text-ar-glyph',
  title: 'text-ar-title font-bold',
  inherit: '',
};
const FACE: Record<ArFace, string> = { text: 'font-ar', display: 'font-ar-display', ui: 'font-ar-ui' };

type Props = Omit<React.HTMLAttributes<HTMLElement>, 'dir' | 'lang'> & {
  children: React.ReactNode;
  /** Block island (a div or the given element) instead of an inline <bdi>. */
  block?: boolean;
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'li';
  size?: ArSize;
  /** Naskh for text (default), Amiri for display, Plex Sans Arabic for tiny UI. */
  face?: ArFace;
  /** Egyptian lines carry lang="ar-EG". */
  variety?: Variety;
};

/**
 * The only way Arabic reaches the page (CLAUDE.md §6.2). Sets lang, dir="rtl", the Arabic face and
 * size, and resets letter-spacing, text-transform and italics so no Latin styling leaks in.
 */
export function ArIsland({ children, block, as, size = 'inherit', face = 'text', variety = 'fusha', className = '', ...rest }: Props) {
  const tag = as ?? (block ? 'div' : 'bdi');
  return createElement(
    tag,
    {
      ...rest,
      lang: variety === 'eg' ? 'ar-EG' : 'ar',
      dir: 'rtl',
      className: `ar ${FACE[face]} ${SIZE[size]} ${className}`.replace(/\s+/g, ' ').trim(),
    },
    children,
  );
}
