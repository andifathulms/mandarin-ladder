import localFont from 'next/font/local';
import { Amiri, IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Newsreader, Noto_Naskh_Arabic } from 'next/font/google';

// Self-hosted at build: no runtime requests to Google.
// Latin faces load latin + latin-ext so transliteration (ā ī ū ḥ ṣ ḍ ṭ ẓ ʿ ʾ) never falls back.
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

// Atkinson Hyperlegible Next isn't in next/font/google for Next 14, so it ships from app/font-files.
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

// Arabic text: every sentence, word, tile, option and glossary entry (DESIGN §4.1).
export const arabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ar',
  display: 'swap',
  fallback: ['serif'],
  adjustFontFallback: false,
});

// Arabic display: big single letters, the سُلَّم wordmark, rung subtitles, the climb moment.
// Its Latin also sets transliteration: Atkinson Hyperlegible Next and Newsreader both lack
// ḥ ṣ ḍ ṭ ẓ ʿ ʾ, and Amiri covers them all (an upright serif, never a system fallback).
export const arabicDisplay = Amiri({
  subsets: ['arabic', 'latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-ar-display',
  display: 'swap',
  fallback: ['serif'],
  adjustFontFallback: false,
});

// Arabic UI: tiny Arabic inside chrome where Naskh is too tall (SVG labels, chips, filters).
export const arabicUi = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500'],
  variable: '--font-ar-ui',
  display: 'swap',
  fallback: ['sans-serif'],
  adjustFontFallback: false,
});

export const fontVariables = [display, body, mono, arabic, arabicDisplay, arabicUi].map((f) => f.variable).join(' ');
