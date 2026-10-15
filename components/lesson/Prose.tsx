import { Fragment } from 'react';
import { parseInline } from '@/lib/markup';
import { hanRuns, hasHan } from '@/lib/zh/text';
import { ZhText } from '../zh/ZhText';
import { pyDisplay } from '../zh/Pinyin';

/**
 * Plain text with any hanzi runs wrapped in lang="zh-Hans" (CLAUDE.md §5.2). Latin text is decomposed
 * (NFD) so pinyin tone vowels quoted in prose render in Atkinson, which positions combining marks.
 */
export function WithHanzi({ text: raw, accent = false }: { text: string; accent?: boolean }) {
  const text = raw.normalize('NFD');
  const runs = hanRuns(text);
  if (!runs.length) return <>{text}</>;
  const out: React.ReactNode[] = [];
  let last = 0;
  runs.forEach((r, i) => {
    if (r.start > last) out.push(<Fragment key={`t${i}`}>{text.slice(last, r.start)}</Fragment>);
    out.push(
      <ZhText key={`z${i}`} className={`text-[1.12em] ${accent ? 'text-accent' : ''}`}>
        {r.text}
      </ZhText>,
    );
    last = r.end;
  });
  if (last < text.length) out.push(<Fragment key="end">{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Latin text that looks like pinyin (tone marks), for lang="zh-Latn-pinyin". */
const looksPinyin = (s: string) => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(s.normalize('NFC'));

/**
 * Explanation text. Paragraphs split on blank lines. **term** marks a Chinese or pinyin term: accent
 * colour for hanzi (never bold), accent bold for pinyin. *italic* marks Indonesian. Bare hanzi in
 * prose are detected and wrapped in lang="zh-Hans".
 */
export function Prose({ text, lang }: { text: string; lang: 'id' | 'en' }) {
  return (
    <div lang={lang} className="flex max-w-measure flex-col gap-3">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>
          {parseInline(para.replace(/\s*\n\s*/g, ' ')).map((tok, j) => {
            if (tok.t === 'strong') {
              if (hasHan(tok.v) && !/[A-Za-z]/.test(tok.v)) {
                return (
                  <ZhText key={j} className="text-[1.12em] text-accent">
                    {tok.v}
                  </ZhText>
                );
              }
              const py = looksPinyin(tok.v);
              return (
                <strong key={j} lang={py ? 'zh-Latn-pinyin' : undefined} className="font-bold not-italic text-accent">
                  {py ? pyDisplay(tok.v) : <WithHanzi text={tok.v} accent />}
                </strong>
              );
            }
            if (tok.t === 'em')
              return (
                <em key={j} lang={lang === 'en' ? 'id' : undefined}>
                  <WithHanzi text={tok.v} />
                </em>
              );
            if (tok.t === 'focus')
              return hasHan(tok.v) ? (
                <ZhText key={j} className="zh-focus text-[1.12em]">
                  {tok.v}
                </ZhText>
              ) : (
                <span key={j} className="focus-word">
                  {tok.v}
                </span>
              );
            return (
              <span key={j}>
                <WithHanzi text={tok.v} />
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
