'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CheckItem } from '@/lib/types';
import { grade, type Response } from '@/lib/check/grade';
import { rng, shuffle } from '@/lib/check/random';
import { sfx } from '@/lib/speech/sfx';
import { parseInline, stripMarkup } from '@/lib/markup';
import { findArabicRuns, hasArabic } from '@/lib/arabic/text';
import { withoutMark } from '@/lib/arabic/marks';
import { OptionPill, type PillState } from './OptionPill';
import { TileTray } from './TileTray';
import { ArTileTray } from './ArTileTray';
import { MarkOption } from './MarkOption';
import { WhyLine } from './WhyLine';
import { Sentence } from '../lesson/Sentence';
import { VisualStage } from '../visuals/VisualStage';
import { ArIsland } from '../ar/ArIsland';
import { ArSentence } from '../ar/ArSentence';
import { IconPlay } from '../ui/Icon';
import { useT } from '../ProgressProvider';
import { useCanPlay, usePlay } from '../useSpeech';

type Common = {
  item: CheckItem;
  /** 1–4 picks an answer. Turn off when several items share a page. */
  numberKeys?: boolean;
};
type Practice = Common & {
  mode: 'practice';
  /** Already solved earlier (e.g. going back to a finished item). */
  solved?: boolean;
  onSolved: (firstTry: boolean) => void;
  /** The parent shows the why line in its feedback sheet once solved. */
  whyInSheet?: boolean;
};
type Test = Common & { mode: 'test'; value?: Response; onChange: (r: Response) => void };

/** Short prompt text with *italic* and **term** markup, Arabic runs in islands. */
function Inline({ text, arClass }: { text: string; arClass?: string }) {
  return (
    <>
      {parseInline(text).map((tok, i) =>
        tok.t === 'em' ? (
          <em key={i}>{tok.v}</em>
        ) : tok.t === 'strong' || tok.t === 'focus' ? (
          hasArabic(tok.v) ? (
            <ArIsland key={i} className={`text-accent ${arClass ?? ''}`}>
              {tok.v}
            </ArIsland>
          ) : (
            <strong key={i} className="text-accent">
              {tok.v}
            </strong>
          )
        ) : hasArabic(tok.v) ? (
          <WithArabic key={i} text={tok.v} arClass={arClass} />
        ) : (
          <span key={i}>{tok.v}</span>
        ),
      )}
    </>
  );
}

/** Latin text with Arabic runs wrapped in inline islands (the line stays LTR). */
function WithArabic({ text, arClass }: { text: string; arClass?: string }) {
  const runs = findArabicRuns(text);
  const out: React.ReactNode[] = [];
  let last = 0;
  runs.forEach((r, i) => {
    if (r.start > last) out.push(<span key={`t${i}`}>{text.slice(last, r.start)}</span>);
    out.push(
      <ArIsland key={`a${i}`} className={arClass}>
        {r.text}
      </ArIsland>,
    );
    last = r.end;
  });
  if (last < text.length) out.push(<span key="end">{text.slice(last)}</span>);
  return <>{out}</>;
}

/** Mostly Latin text (a question in Indonesian) stays an LTR line even when it quotes Arabic. */
const isLatinLine = (s: string) => /[A-Za-z]/.test(stripMarkup(s));

const seedOf = (id: string) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** A choice/gap prompt. Arabic prompts are an RTL island with the blank as an underline. */
function Prompt({ text, fill }: { text: string; fill?: string }) {
  const [a, b] = text.split('___');
  if (b === undefined) {
    if (hasArabic(text) && !isLatinLine(text))
      return <ArSentence ar={text} play={false} showTranslit={false} />;
    return (
      <p lang="id" className="font-display text-sentence font-medium text-ink">
        <Inline text={text} arClass="text-ar-sentence leading-none" />
      </p>
    );
  }
  const blank = (
    <>
      <span
        aria-hidden
        className="mx-1 inline-block w-[3.5em] border-b-2 border-ink align-baseline"
      >
        &nbsp;
      </span>
      <span className="sr-only">blank</span>
    </>
  );
  if ((hasArabic(text) && !isLatinLine(text)) || (!isLatinLine(text) && fill && hasArabic(fill))) {
    return (
      <ArIsland block as="p" size="sentence" className="text-ink">
        {stripMarkup(a)}
        {fill ? <span className="ar-focus">{fill}</span> : blank}
        {stripMarkup(b)}
      </ArIsland>
    );
  }
  return (
    <p lang="id" className="font-display text-sentence font-medium text-ink">
      <WithArabic text={stripMarkup(a)} arClass="text-ar-sentence leading-none" />
      {fill ? (
        hasArabic(fill) ? (
          <ArIsland className="ar-focus text-ar-sentence leading-none">{fill}</ArIsland>
        ) : (
          <span className="focus-word">{fill}</span>
        )
      ) : (
        blank
      )}
      <WithArabic text={stripMarkup(b)} arClass="text-ar-sentence leading-none" />
    </p>
  );
}

/** A big round play button for listen and dictation items. */
function BigPlay({
  audio,
  variety,
  label,
}: {
  audio: string;
  variety: 'fusha' | 'eg';
  label: string;
}) {
  const play = usePlay();
  const [playing, setPlaying] = useState(false);
  const run = async () => {
    setPlaying(true);
    await play(stripMarkup(audio));
    setPlaying(false);
  };
  return (
    <button
      type="button"
      onClick={run}
      aria-pressed={playing || undefined}
      aria-label={label}
      className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-accent text-accent-ink"
      data-play
    >
      <IconPlay size={24} />
    </button>
  );
}

/** Plays the line to identify. With no recording and no Arabic voice, the text is shown instead. */
function ListenPrompt({
  audio,
  prompt,
  variety,
}: {
  audio: string;
  prompt?: string;
  variety: 'fusha' | 'eg';
}) {
  const { t } = useT();
  const canPlay = useCanPlay(audio);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-muted">{<Inline text={prompt ?? t('check.listenPrompt')} />}</p>
      {canPlay ? (
        <BigPlay audio={audio} variety={variety} label={t('check.listenPlay')} />
      ) : (
        <div className="flex flex-col gap-1 rounded-md bg-paper-2 p-4">
          <p className="text-small text-muted">{t('check.listenNoAudio')}</p>
          <ArSentence ar={audio} variety={variety} play={false} showTranslit={false} size="body" />
        </div>
      )}
    </div>
  );
}

/** The word with the target letter's mark hidden: the letter sits in a dashed circle. */
function MarkPrompt({ ar, target, shown }: { ar: string; target: number; shown?: string }) {
  const { before, letter, after } = withoutMark(stripMarkup(ar), target);
  return (
    <ArIsland
      block
      as="p"
      size="sentence"
      className="text-center text-ink"
      aria-label={stripMarkup(ar)}
    >
      {before}
      <span className="relative inline-block rounded-full px-1 outline-dashed outline-2 outline-offset-4 outline-accent">
        {letter}
        {shown}
      </span>
      {after}
    </ArIsland>
  );
}

export function CheckItemView(props: Practice | Test) {
  const { item } = props;
  const { t } = useT();
  const practice = props.mode === 'practice';
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(practice && !!(props as Practice).solved);
  const missesRef = useRef(0);

  // Tiles for order and spell items. Spell tiles are shuffled deterministically per item.
  const tiles = useMemo(() => {
    if (item.type === 'order') return item.tiles;
    if (item.type === 'spell')
      return shuffle([...item.letters, ...item.distractors], rng(seedOf(item.id)));
    return [];
  }, [item]);
  const answerTiles =
    item.type === 'order' ? item.answer : item.type === 'spell' ? item.letters : [];
  const [placed, setPlaced] = useState<number[]>(() => {
    const used = new Set<number>();
    const indexOf = (w: string) => {
      const i = tiles.findIndex((x, j) => x === w && !used.has(j));
      used.add(i);
      return i;
    };
    if (practice && (props as Practice).solved) return answerTiles.map(indexOf);
    if (!practice && Array.isArray((props as Test).value))
      return ((props as Test).value as string[]).map(indexOf);
    return [];
  });
  const [tilesOff, setTilesOff] = useState(false);

  const options: string[] = 'options' in item ? (item.options as string[]) : [];

  const pick = (opt: string) => {
    if (!practice) {
      (props as Test).onChange(opt);
      return;
    }
    if (solved || wrong.includes(opt)) return;
    if (grade(item, opt).correct) {
      setSolved(true);
      sfx('correct');
      (props as Practice).onSolved(missesRef.current === 0);
    } else {
      missesRef.current += 1;
      setWrong((w) => [...w, opt]);
      sfx('wrong');
    }
  };

  const checkTiles = () => {
    if (!practice) return;
    const resp = placed.map((i) => tiles[i]);
    if (grade(item, resp).correct) {
      setSolved(true);
      setTilesOff(false);
      sfx('correct');
      (props as Practice).onSolved(missesRef.current === 0);
    } else {
      missesRef.current += 1;
      setTilesOff(true);
      setWrong((w) => [...w, resp.join(' ')]);
      sfx('wrong');
    }
  };

  // 1–4 picks an answer.
  const numberKeys = props.numberKeys ?? true;
  useEffect(() => {
    if (!numberKeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && options[n - 1] !== undefined) {
        e.preventDefault();
        pick(options[n - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const answer = 'answer' in item && typeof item.answer === 'string' ? item.answer : '';
  const pillState = (opt: string): PillState => {
    if (!practice) return (props as Test).value === opt ? 'selected' : 'idle';
    if (solved && stripMarkup(opt) === stripMarkup(answer)) return 'correct';
    if (wrong.includes(opt)) return 'wrong';
    return 'idle';
  };

  const missed = wrong.length;
  const inSheet = practice && !!(props as Practice).whyInSheet;
  const showWhy = practice && (solved ? !inSheet : missed >= 2);
  const arabicOptions = options.some(hasArabic);
  const wideOptions =
    arabicOptions || item.type === 'fix' || item.type === 'scene' || item.type === 'listen';
  const tileItem = item.type === 'order' || item.type === 'spell';
  const arabicTiles =
    item.type === 'spell' || (item.type === 'order' && item.tiles.some(hasArabic));

  return (
    <div className="flex flex-col gap-5" data-item={item.id}>
      {item.cue && (
        <p lang="id" className="id-text">
          <Inline text={item.cue} />
        </p>
      )}

      {(item.type === 'choice' || item.type === 'gap') && (
        <Prompt text={item.prompt} fill={solved ? item.answer : undefined} />
      )}
      {item.type === 'fix' && (
        <div className="flex flex-col gap-2">
          <p className="text-small text-muted">{t('check.fixPrompt')}</p>
          {hasArabic(item.wrong) && !isLatinLine(item.wrong) ? (
            <ArSentence ar={item.wrong} off play={false} showTranslit={false} />
          ) : (
            <Sentence en={item.wrong} off />
          )}
        </div>
      )}
      {item.type === 'scene' && (
        <div className="flex flex-col gap-3">
          <VisualStage visual={item.visual} interactive={false} />
          <p className="text-small text-muted">
            {<Inline text={item.prompt ?? t('check.scenePrompt')} />}
          </p>
        </div>
      )}
      {item.type === 'listen' && (
        <ListenPrompt audio={item.audio} prompt={item.prompt} variety={item.variety} />
      )}
      {/* Reading items never show transliteration, whatever the rung's setting (CLAUDE.md §5.3). */}
      {item.type === 'read' && (
        <div className="flex flex-col gap-3">
          <p className="text-small text-muted">
            {<Inline text={item.prompt ?? t('check.readPrompt')} />}
          </p>
          <div className="rounded-lg bg-paper-2 px-4 py-3">
            <ArSentence
              ar={item.ar}
              size={
                [...stripMarkup(item.ar)].filter((c) => /[ء-ي]/.test(c)).length <= 2
                  ? 'glyph'
                  : 'sentence'
              }
              play={false}
              showTranslit={false}
            />
          </div>
        </div>
      )}
      {item.type === 'mark' && (
        <div className="flex flex-col gap-3">
          <p className="text-small text-muted">
            {<Inline text={item.prompt ?? t('check.markPrompt')} />}
          </p>
          <div className="rounded-lg bg-paper-2 px-4 py-4">
            <MarkPrompt ar={item.ar} target={item.target} />
          </div>
        </div>
      )}
      {item.type === 'spell' && (
        <div className="flex flex-col gap-3">
          {item.prompt && (
            <p className="text-small text-muted">
              <Inline text={item.prompt} />
            </p>
          )}
          {item.dictation && item.audio && (
            <div className="flex items-center gap-3">
              <BigPlay audio={item.audio} variety="fusha" label={t('check.dictationPlay')} />
              <span className="text-small text-muted">{t('check.dictationHint')}</span>
            </div>
          )}
        </div>
      )}
      {item.type === 'order' && item.prompt && <Prompt text={item.prompt} />}

      {tileItem ? (
        <div className="flex flex-col gap-3">
          {arabicTiles ? (
            <ArTileTray
              tiles={tiles}
              placed={placed}
              mode={item.type === 'spell' ? 'spell' : 'order'}
              slots={answerTiles.length}
              onChange={(p) => {
                setPlaced(p);
                setTilesOff(false);
                if (!practice) (props as Test).onChange(p.map((i) => tiles[i]));
              }}
              locked={solved}
              tone={solved ? 'good' : tilesOff ? 'off' : 'idle'}
            />
          ) : (
            <TileTray
              tiles={tiles}
              placed={placed}
              onChange={(p) => {
                setPlaced(p);
                setTilesOff(false);
                if (!practice) (props as Test).onChange(p.map((i) => tiles[i]));
              }}
              locked={solved}
              tone={solved ? 'good' : tilesOff ? 'off' : 'idle'}
            />
          )}
          {practice && !solved && (
            <button
              type="button"
              className="btn btn-primary self-start"
              disabled={placed.length !== answerTiles.length}
              onClick={checkTiles}
            >
              {t('check.checkOrder')}
            </button>
          )}
        </div>
      ) : item.type === 'mark' ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('check.markOptions')}>
          {item.options.map((m, i) => (
            <MarkOption
              key={m}
              mark={m}
              index={i}
              state={pillState(m)}
              disabled={practice && (solved || wrong.includes(m))}
              onClick={() => pick(m)}
            />
          ))}
        </div>
      ) : (
        <div className={wideOptions ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'} role="group">
          {options.map((opt, i) => (
            <OptionPill
              key={opt}
              label={opt}
              index={i}
              wide={wideOptions}
              badge={arabicOptions}
              state={pillState(opt)}
              disabled={practice && (solved || wrong.includes(opt))}
              onClick={() => pick(opt)}
            />
          ))}
        </div>
      )}

      <div aria-live="polite" className="flex min-h-[1.6em] flex-col gap-2">
        {practice && !solved && missed > 0 && <p className="text-off">{t('check.wrong')}</p>}
        {practice && solved && !inSheet && <p className="sr-only">{t('check.correct')}</p>}
        {showWhy && <WhyLine why={item.why} hint={!solved} />}
      </div>
    </div>
  );
}
