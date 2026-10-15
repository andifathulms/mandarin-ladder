import { createElement } from 'react';

type Props = Omit<React.HTMLAttributes<HTMLElement>, 'lang'> & {
  children: React.ReactNode;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3';
  /** WenKai for teaching text (default); Noto Sans SC for small hanzi in UI chrome. */
  face?: 'zh' | 'ui';
};

/**
 * Plain Chinese text (no ruby): rung subtitles, chips, labels. Sets lang="zh-Hans" and the hanzi
 * face, and resets italics, letter-spacing and case so Latin styling never leaks onto hanzi.
 */
export function ZhText({ children, as = 'span', face = 'zh', className = '', ...rest }: Props) {
  return createElement(
    as,
    { ...rest, lang: 'zh-Hans', className: `zh ${face === 'ui' ? 'font-zh-ui' : 'font-zh'} ${className}`.trim() },
    children,
  );
}
