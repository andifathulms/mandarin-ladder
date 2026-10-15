import { Fragment } from 'react';
import { parseInline } from '@/lib/markup';
import { findArabicRuns, hasArabic } from '@/lib/arabic/text';
import { ArIsland } from '../ar/ArIsland';

/** Plain text with any Arabic runs wrapped in inline islands. */
function WithIslands({ text, accent = false }: { text: string; accent?: boolean }) {
  const runs = findArabicRuns(text);
  if (!runs.length) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let last = 0;
  runs.forEach((r, i) => {
    if (r.start > last) out.push(<Fragment key={`t${i}`}>{text.slice(last, r.start)}</Fragment>);
    out.push(
      <ArIsland key={`a${i}`} size="small" className={accent ? 'text-accent' : undefined}>
        {r.text}
      </ArIsland>,
    );
    last = r.end;
  });
  if (last < text.length) out.push(<Fragment key="end">{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/**
 * Explanation text. Paragraphs split on blank lines. **term** marks a target-language term:
 * accent bold for Latin, accent colour only for Arabic (never bold). *italic* marks Indonesian.
 * Bare Arabic in prose is detected and wrapped in an island.
 */
export function Prose({ text, lang }: { text: string; lang: 'id' | 'en' }) {
  return (
    <div lang={lang} className="flex max-w-measure flex-col gap-3">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>
          {parseInline(para.replace(/\s*\n\s*/g, ' ')).map((tok, j) => {
            if (tok.t === 'strong') {
              if (hasArabic(tok.v) && !/[A-Za-z]/.test(tok.v)) {
                return (
                  <ArIsland key={j} size="small" className="text-accent">
                    {tok.v}
                  </ArIsland>
                );
              }
              return (
                <strong key={j} lang="ar-Latn" className="font-bold not-italic text-accent">
                  <WithIslands text={tok.v} accent />
                </strong>
              );
            }
            if (tok.t === 'em')
              return (
                <em key={j} lang={lang === 'en' ? 'id' : undefined}>
                  <WithIslands text={tok.v} />
                </em>
              );
            if (tok.t === 'focus')
              return hasArabic(tok.v) ? (
                <ArIsland key={j} size="small" className="ar-focus">
                  {tok.v}
                </ArIsland>
              ) : (
                <span key={j} lang="ar-Latn" className="focus-word">
                  {tok.v}
                </span>
              );
            return (
              <span key={j}>
                <WithIslands text={tok.v} />
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
