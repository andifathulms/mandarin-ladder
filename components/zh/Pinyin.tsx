import { Fragment } from 'react';
import { syllables } from '@/lib/zh/pinyin';
import { parseInline } from '@/lib/markup';

/**
 * Pinyin is rendered decomposed (NFD): Atkinson Hyperlegible Next has the combining tone marks with
 * mark positioning but not every precomposed tone vowel (ǎ ǚ), so NFD never falls back to another font.
 */
export const pyDisplay = (s: string) => s.normalize('NFD');

/** The tone class for a syllable: tone-1…tone-4, tone-0 for neutral (CLAUDE.md §7.2). */
export const toneClass = (tone: number) => `tone-${tone}`;

type Props = {
  text: string;
  /** Colour each syllable by its tone. */
  tones?: boolean;
  className?: string;
};

/**
 * Pinyin on its own line (Dasar 1, glossary, deck): upright, lang="zh-Latn-pinyin", optionally
 * tone-coloured per syllable. [[focus]] marks are underlined.
 */
export function Pinyin({ text, tones = false, className = '' }: Props) {
  return (
    <span lang="zh-Latn-pinyin" className={`py ${className}`}>
      {parseInline(text).map((tok, i) => (
        <span key={i} className={tok.t === 'focus' ? 'py-focus' : undefined}>
          <ToneRun text={tok.v} tones={tones} />
        </span>
      ))}
    </span>
  );
}

/** Pinyin words with each syllable wrapped in its tone class. Words that don't parse pass through. */
export function ToneRun({ text, tones }: { text: string; tones: boolean }) {
  if (!tones) return <>{pyDisplay(text)}</>;
  return (
    <>
      {text.split(/(\s+|[,.!?;:'"()…—-]+)/).map((part, i) => {
        const syl = /^[^\s,.!?;:'"()…—-]+$/.test(part) ? syllables(part) : null;
        if (!syl) return <Fragment key={i}>{pyDisplay(part)}</Fragment>;
        return (
          <Fragment key={i}>
            {syl.map((s, k) => (
              <span key={k} className={toneClass(s.tone)}>
                {(k > 0 && /^[aoeāáǎàōóǒòēéěè]/i.test(s.text) ? "'" : '') + pyDisplay(s.text)}
              </span>
            ))}
          </Fragment>
        );
      })}
    </>
  );
}

/** ToneText: pinyin coloured per syllable, always (for tone drills and the Nada card). */
export function ToneText({ text, className = '' }: { text: string; className?: string }) {
  return <Pinyin text={text} tones className={className} />;
}
