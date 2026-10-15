import localFont from 'next/font/local';
import { IBM_Plex_Mono, Newsreader } from 'next/font/google';

// Self-hosted at build: no runtime requests to Google. Hanzi faces are not here: they are subset at
// build time by scripts/fonts-subset.ts into styles/fonts-zh.css (CLAUDE.md §7.6).
export const display = Newsreader({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  // Next has no fallback metrics for Newsreader; Georgia is close enough without adjustment.
  adjustFontFallback: false,
});

// Atkinson Hyperlegible Next (full Latin and Latin Extended, from the upstream webfonts) also sets
// pinyin. It has the combining macron, acute, caron and grave with mark positioning but not every
// precomposed tone vowel (ǎ ǚ…), so pinyin is rendered decomposed (NFD): see components/zh/Pinyin.
export const body = localFont({
  src: [
    { path: './font-files/AtkinsonNext-Variable.woff2', weight: '200 800', style: 'normal' },
    { path: './font-files/AtkinsonNext-Italic-Variable.woff2', weight: '200 800', style: 'italic' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const fontVariables = [display, body, mono].map((f) => f.variable).join(' ');
