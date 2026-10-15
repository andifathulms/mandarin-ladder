'use client';

import { Fragment } from 'react';
import { tryAlign } from '@/lib/zh/align';
import { hasHan, joinZh, tokens } from '@/lib/zh/text';
import { parseInline } from '@/lib/markup';
import { RubyWord } from './Ruby';
import { pinyinVisible, useZhText } from './ZhContext';
import { pyDisplay } from './Pinyin';

type Props = {
  /** Authored Chinese (spaced words), or Latin text with hanzi runs ("Apa arti **桌子**?"). */
  text: string;
  /** The item's pinyin map: Chinese string (or hanzi run) → pinyin. */
  py?: Record<string, string>;
  /** Override the fade (reading items pass false). */
  showPinyin?: boolean;
  /** Replace ___ with this Chinese word (a solved gap), or draw a blank. */
  fill?: string;
  className?: string;
};

const Blank = () => (
  <>
    <span aria-hidden className="mx-1 inline-block w-[2.5em] border-b-2 border-ink align-baseline">
      &nbsp;
    </span>
    <span className="sr-only">blank</span>
  </>
);

/** One authored Chinese string as inline ruby words (no play button, no word sheet). */
function ZhRun({ zh, py, show, tones }: { zh: string; py?: string; show: (w: string) => boolean; tones: boolean }) {
  const words = py ? tryAlign(zh, py) : null;
  if (!words) {
    return (
      <span lang="zh-Hans" className="zh font-zh">
        {joinZh(tokens(zh))}
      </span>
    );
  }
  return (
    <span lang="zh-Hans" className="zh zh-line font-zh">
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && w.kind !== 'punct' && <wbr />}
          {w.text === '___' ? <Blank /> : <span className={w.focus ? (tones ? 'zh-focus zh-focus-tones' : 'zh-focus') : undefined}><RubyWord word={w} showPinyin={show(w.text)} toneColours={tones} /></span>}
        </Fragment>
      ))}
      {words.every((w) => w.kind !== 'han' || show(w.text)) && (
        <span className="sr-only" lang="zh-Latn-pinyin">
          {' '}({pyDisplay(words.map((w) => w.py).join(' '))})
        </span>
      )}
    </span>
  );
}

/**
 * Chinese inside check items (DESIGN §6.7): pure Chinese strings as ruby words per the fade; Latin
 * prompts keep their markup with each hanzi run in ruby; ___ is a blank or the solved word.
 */
export function ZhInline({ text, py = {}, showPinyin, fill, className = '' }: Props) {
  const ctx = useZhText();
  const show = (w: string) => showPinyin ?? pinyinVisible(ctx, w);
  const tones = ctx.toneColours;
  const latin = /[A-Za-z]/.test(text.replace(/\*\*|\*|\[\[|\]\]|___/g, ''));

  if (!latin) {
    if (text.includes('___')) {
      const [a, b] = text.split('___');
      return (
        <span className={className}>
          {a.trim() && <ZhRun zh={a.trim()} py={py[text] ? py[text].split('___')[0].trim() : undefined} show={show} tones={tones} />}
          {fill ? (
            <span className="zh-focus">
              <ZhRun zh={fill} py={py[fill]} show={show} tones={tones} />
            </span>
          ) : (
            <Blank />
          )}
          {b.trim() && <ZhRun zh={b.trim()} py={py[text] ? py[text].split('___')[1]?.trim() : undefined} show={show} tones={tones} />}
        </span>
      );
    }
    return (
      <span className={className}>
        <ZhRun zh={text} py={py[text]} show={show} tones={tones} />
      </span>
    );
  }

  // Latin text: markup as in prose; hanzi runs as ruby, ___ as a blank.
  const parts = text.split('___');
  return (
    <span className={className}>
      {parts.map((part, pi) => (
        <Fragment key={pi}>
          {parseInline(part).map((tok, i) => {
            const body = splitRuns(tok.v).map((r, k) =>
              r.han ? (
                <span key={k} className={tok.t === 'strong' || tok.t === 'focus' ? 'text-accent' : undefined}>
                  <ZhRun zh={r.text} py={py[r.text]} show={show} tones={tones && tok.t !== 'strong'} />
                </span>
              ) : (
                <Fragment key={k}>{r.text.normalize('NFD')}</Fragment>
              ),
            );
            if (tok.t === 'em') return <em key={i}>{body}</em>;
            if ((tok.t === 'strong' || tok.t === 'focus') && !hasHan(tok.v)) {
              return (
                <strong key={i} className="text-accent">
                  {body}
                </strong>
              );
            }
            return <Fragment key={i}>{body}</Fragment>;
          })}
          {pi < parts.length - 1 && (fill ? <span className="zh-focus"><ZhRun zh={fill} py={py[fill]} show={show} tones={tones} /></span> : <Blank />)}
        </Fragment>
      ))}
    </span>
  );
}

function splitRuns(s: string): { text: string; han: boolean }[] {
  const out: { text: string; han: boolean }[] = [];
  for (const m of s.matchAll(/(\p{Script=Han}+)|([^\p{Script=Han}]+)/gu)) out.push({ text: m[0], han: !!m[1] });
  return out;
}
