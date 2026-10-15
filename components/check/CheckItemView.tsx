'use client';

import { useEffect, useRef, useState } from 'react';
import type { CheckItem } from '@/lib/types';
import { grade, parseTones, type Response } from '@/lib/check/grade';
import { sfx } from '@/lib/speech/sfx';
import * as store from '@/lib/progress/store';
import { isSyllableKey } from '@/lib/speech/audio';
import { hasHan } from '@/lib/zh/text';
import { OptionPill, type PillState } from './OptionPill';
import { TileTray } from './TileTray';
import { WhyLine } from './WhyLine';
import { TraceCheck } from './TraceCheck';
import { VisualStage } from '../visuals/VisualStage';
import { ZhInline } from '../zh/ZhInline';
import { ToneOption } from '../zh/ToneOption';
import { PinyinInput } from '../zh/PinyinInput';
import { ComponentTiles } from '../zh/ComponentTiles';
import { Pinyin } from '../zh/Pinyin';
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

const isLatinLine = (s: string) => /[A-Za-z]/.test(s.replace(/\*\*|\*|\[\[|\]\]|___/g, ''));

/** A prompt or sentence: Chinese in ruby per the item's pinyin setting, Latin as a display line. */
function Prompt({ item, text, fill, off }: { item: CheckItem; text: string; fill?: string; off?: boolean }) {
  const latin = isLatinLine(text);
  return (
    <p
      lang={latin ? 'id' : undefined}
      className={`${latin ? 'font-display text-sentence font-medium' : 'text-zh-sentence font-medium'} ${off ? 'off-text' : 'text-ink'}`}
    >
      <ZhInline text={text} py={item.py} showPinyin={item.show_pinyin} fill={fill} />
    </p>
  );
}

/** A big round play button for listen, tone and pinyin items. */
function BigPlay({ audio, label }: { audio: string; label: string }) {
  const play = usePlay();
  const [playing, setPlaying] = useState(false);
  const run = async () => {
    setPlaying(true);
    await play(audio);
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

/**
 * Plays the audio to identify. With no recording and no Chinese voice, the text is shown instead:
 * Chinese text without pinyin, a syllable as its pinyin (then the item tests reading the marks).
 */
function ListenPrompt({ item, audio, prompt }: { item: CheckItem; audio: string; prompt?: string }) {
  const { t } = useT();
  const canPlay = useCanPlay(audio);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-muted">
        <ZhInline text={prompt ?? t('check.listenPrompt')} py={item.py} />
      </p>
      {canPlay ? (
        <BigPlay audio={audio} label={t('check.listenPlay')} />
      ) : (
        <div className="flex flex-col gap-1 rounded-md bg-paper-2 p-4">
          <p className="text-small text-muted">{t('check.listenNoAudio')}</p>
          {isSyllableKey(audio) ? (
            <Pinyin text={audio.slice(4)} className="text-h2" />
          ) : (
            <p className="text-zh-sentence">
              <ZhInline text={audio} py={item.py} showPinyin={false} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CheckItemView(props: Practice | Test) {
  const { item } = props;
  const { t } = useT();
  const practice = props.mode === 'practice';
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(practice && !!(props as Practice).solved);
  const missesRef = useRef(0);

  const tiles = item.type === 'order' ? item.tiles : [];
  const answerTiles = item.type === 'order' ? item.answer : [];
  const [placed, setPlaced] = useState<number[]>(() => {
    const used = new Set<number>();
    const indexOf = (w: string) => {
      const i = tiles.findIndex((x, j) => x === w && !used.has(j));
      used.add(i);
      return i;
    };
    if (practice && (props as Practice).solved) return answerTiles.map(indexOf);
    if (!practice && Array.isArray((props as Test).value)) return ((props as Test).value as string[]).map(indexOf);
    return [];
  });
  const [typed, setTyped] = useState(() => (!practice && typeof (props as Test).value === 'string' ? ((props as Test).value as string) : ''));
  const [chosen, setChosen] = useState<string[]>(() =>
    item.type === 'build' ? (practice && (props as Practice).solved ? item.answer : !practice && Array.isArray((props as Test).value) ? ((props as Test).value as string[]) : []) : [],
  );
  const [off, setOff] = useState(false);

  const options: string[] = 'options' in item && item.type !== 'tone' ? (item.options as string[]) : [];
  const toneOptions = item.type === 'tone' ? item.options.map((o) => o.join(',')) : [];

  const succeed = () => {
    setSolved(true);
    setOff(false);
    sfx('correct');
    (props as Practice).onSolved(missesRef.current === 0);
  };
  const fail = (key: string) => {
    missesRef.current += 1;
    setOff(true);
    setWrong((w) => (w.includes(key) ? w : [...w, key]));
    sfx('wrong');
  };

  const pick = (opt: string) => {
    if (!practice) {
      (props as Test).onChange(opt);
      return;
    }
    if (solved || wrong.includes(opt)) return;
    if (grade(item, opt).correct) succeed();
    else fail(opt);
  };

  const submit = (resp: Response) => {
    if (!practice || solved) return;
    if (grade(item, resp).correct) succeed();
    else fail(Array.isArray(resp) ? resp.join(' ') : resp);
  };

  // 1–4 picks an answer.
  const numberKeys = props.numberKeys ?? true;
  const keyOptions = item.type === 'tone' ? toneOptions : options;
  useEffect(() => {
    if (!numberKeys || !keyOptions.length) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4 && keyOptions[n - 1] !== undefined) {
        e.preventDefault();
        pick(keyOptions[n - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const answer = 'answer' in item && typeof item.answer === 'string' ? item.answer : item.type === 'tone' ? item.answer.join(',') : '';
  const pillState = (opt: string): PillState => {
    if (!practice) return (props as Test).value === opt ? 'selected' : 'idle';
    if (solved && (item.type === 'tone' ? opt === answer : grade(item, opt).correct)) return 'correct';
    if (wrong.includes(opt)) return 'wrong';
    return 'idle';
  };

  const missed = wrong.length;
  const inSheet = practice && !!(props as Practice).whyInSheet;
  const showWhy = practice && (solved ? !inSheet : missed >= 2);
  const zhOptions = options.some(hasHan);
  const wideOptions = zhOptions || item.type === 'fix' || item.type === 'scene' || item.type === 'listen';
  const toneState: 'idle' | 'good' | 'off' = solved ? 'good' : off ? 'off' : 'idle';

  return (
    <div className="flex flex-col gap-5" data-item={item.id} data-type={item.type}>
      {item.cue && (
        <p lang="id" className="id-text">
          <ZhInline text={item.cue} py={item.py} />
        </p>
      )}

      {(item.type === 'choice' || item.type === 'gap') && <Prompt item={item} text={item.prompt} fill={solved ? item.answer : undefined} />}
      {item.type === 'fix' && (
        <div className="flex flex-col gap-2">
          <p className="text-small text-muted">{t('check.fixPrompt')}</p>
          <Prompt item={item} text={item.wrong} off />
        </div>
      )}
      {item.type === 'scene' && (
        <div className="flex flex-col gap-3">
          <VisualStage visual={item.visual} interactive={false} />
          <p className="text-small text-muted">
            <ZhInline text={item.prompt ?? t('check.scenePrompt')} py={item.py} />
          </p>
        </div>
      )}
      {item.type === 'listen' && <ListenPrompt item={item} audio={item.audio} prompt={item.prompt} />}
      {item.type === 'tone' && (
        <ListenPrompt item={item} audio={item.audio} prompt={item.prompt ?? t(item.ask === 'spoken' ? 'check.tonePromptSpoken' : 'check.tonePrompt')} />
      )}
      {item.type === 'pinyin' && <ListenPrompt item={item} audio={item.audio} prompt={item.prompt ?? t('check.pinyinPrompt')} />}
      {item.type === 'order' && item.prompt && <Prompt item={item} text={item.prompt} />}
      {(item.type === 'build' || item.type === 'trace') && item.prompt && (
        <p className="text-small text-muted">
          <ZhInline text={item.prompt} py={item.py} />
        </p>
      )}

      {item.type === 'order' ? (
        <div className="flex flex-col gap-3">
          <TileTray
            tiles={tiles}
            placed={placed}
            py={item.py}
            showPinyin={item.show_pinyin}
            onChange={(p) => {
              setPlaced(p);
              setOff(false);
              if (!practice) (props as Test).onChange(p.map((i) => tiles[i]));
            }}
            locked={solved}
            tone={toneState}
          />
          {practice && !solved && (
            <button type="button" className="btn btn-primary self-start" disabled={placed.length !== answerTiles.length} onClick={() => submit(placed.map((i) => tiles[i]))}>
              {t('check.checkOrder')}
            </button>
          )}
        </div>
      ) : item.type === 'tone' ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('check.toneOptions')}>
          {item.options.map((o, i) => {
            const key = o.join(',');
            const state: PillState = !practice
              ? Array.isArray((props as Test).value) || typeof (props as Test).value === 'string'
                ? parseTones((props as Test).value as Response).join(',') === key
                  ? 'selected'
                  : 'idle'
                : 'idle'
              : pillState(key);
            return <ToneOption key={key} tones={o} index={i} state={state} disabled={practice && (solved || wrong.includes(key))} onClick={() => pick(key)} />;
          })}
        </div>
      ) : item.type === 'pinyin' ? (
        <div className="flex flex-col gap-3">
          <PinyinInput
            value={typed}
            label={t('check.pinyinLabel')}
            disabled={solved}
            tone={toneState}
            onChange={(v) => {
              setTyped(v);
              setOff(false);
              if (!practice) (props as Test).onChange(v);
            }}
            onSubmit={practice ? () => typed.trim() && submit(typed) : undefined}
          />
          {practice && !solved && (
            <button type="button" className="btn btn-primary self-start" disabled={!typed.trim()} onClick={() => submit(typed)}>
              {t('check.checkOrder')}
            </button>
          )}
          {practice && solved && <Pinyin text={item.answer} tones className="text-h2" />}
        </div>
      ) : item.type === 'build' ? (
        <div className="flex flex-col gap-3">
          <ComponentTiles
            parts={item.parts}
            chosen={chosen}
            need={item.answer.length}
            char={item.char}
            solved={solved}
            locked={solved}
            tone={toneState}
            onChange={(c) => {
              setChosen(c);
              setOff(false);
              if (!practice) (props as Test).onChange(c);
            }}
          />
          {practice && !solved && (
            <button type="button" className="btn btn-primary self-start" disabled={chosen.length !== item.answer.length} onClick={() => submit(chosen)}>
              {t('check.checkOrder')}
            </button>
          )}
        </div>
      ) : item.type === 'trace' ? (
        <TraceCheck
          item={item}
          solved={solved}
          onDone={(misses) => {
            const resp = `misses:${misses}`;
            store.recordTrace(item.char, misses);
            if (!practice) (props as Test).onChange(resp);
            else {
              missesRef.current = misses > 2 ? 1 : 0;
              if (grade(item, resp).correct) succeed();
              else {
                fail(resp);
              }
            }
          }}
        />
      ) : (
        <div className={wideOptions ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'} role="group">
          {options.map((opt, i) => (
            <OptionPill
              key={opt}
              label={opt}
              index={i}
              wide={wideOptions}
              badge={zhOptions}
              py={item.py}
              showPinyin={item.show_pinyin}
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
