'use client';

import { useMemo, useState } from 'react';
import type { CheckItem } from '@/lib/types';
import { STROKE_NAMES, type StrokeName } from '@/lib/zh/trace';
import { TracePad } from '../zh/TracePad';
import { useStrokes } from '../zh/useStrokes';
import { PracticeGrid, useStrokeNames } from '../visuals/StrokeOrder';
import { ZhText } from '../zh/ZhText';
import { useT } from '../ProgressProvider';

type Props = { item: Extract<CheckItem, { type: 'trace' }>; solved?: boolean; onDone: (misses: number) => void };

const ALL: StrokeName[] = ['heng', 'shu', 'pie', 'dian', 'na', 'ti', 'zhe', 'gou'];

/**
 * The keyboard and screen-reader alternative to tracing (PRD §9, DESIGN §12): the strokes drawn so far,
 * and "which stroke comes next?" with stroke names. A wrong pick is a miss for that stroke.
 */
function StrokeQuiz({ char, onDone }: { char: string; onDone: (misses: number) => void }) {
  const { t, lang } = useT();
  const data = useStrokes(char);
  const names = useStrokeNames(char, data?.medians);
  const [k, setK] = useState(0);
  const [misses, setMisses] = useState(0);
  const [wrong, setWrong] = useState<StrokeName[]>([]);
  const n = names.length;
  // Four options: the right name and three others, in a fixed order per stroke.
  const options = useMemo(() => {
    if (!names[k]) return [];
    const others = ALL.filter((x) => x !== names[k]);
    const pick = [0, 1, 2].map((i) => others[(k * 3 + i * 2) % others.length]);
    const set = [names[k], ...pick.filter((x, i, a) => a.indexOf(x) === i)].slice(0, 4);
    return ALL.filter((x) => set.includes(x));
  }, [names, k]);
  if (!data) return null;
  const choose = (s: StrokeName) => {
    if (s === names[k]) {
      setWrong([]);
      if (k + 1 >= n) onDone(misses);
      setK(k + 1);
    } else if (!wrong.includes(s)) {
      setMisses((m) => m + 1);
      setWrong((w) => [...w, s]);
    }
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 1024 1024" className="h-[160px] w-[160px] rounded-md bg-surface" role="img" aria-label={t('trace.quizSoFar', { ch: char, n: k, total: n })}>
        <PracticeGrid />
        <g transform="translate(0 900) scale(1 -1)">
          {data.strokes.map((d, i) => (
            <path key={i} d={d} style={{ fill: i < k ? 'var(--ink)' : 'var(--rule)' }} />
          ))}
        </g>
      </svg>
      {k < n ? (
        <fieldset className="flex flex-col items-center gap-2">
          <legend className="mb-2 text-small text-muted">{t('trace.quizAsk', { n: k + 1, total: n })}</legend>
          <div className="flex flex-wrap justify-center gap-2">
            {options.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => choose(s)}
                disabled={wrong.includes(s)}
                className={`flex min-h-pill items-center gap-2 rounded-full border-2 px-4 ${wrong.includes(s) ? 'border-off-bg bg-off-bg text-off line-through' : 'border-rule bg-surface text-ink hover:border-accent'}`}
                data-stroke-option={s}
              >
                <ZhText face="ui">{STROKE_NAMES[s].zh}</ZhText>
                <span lang="zh-Latn-pinyin">{STROKE_NAMES[s].py.normalize('NFD')}</span>
                <span className="text-small text-muted">{STROKE_NAMES[s][lang]}</span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="text-small text-good">{t('trace.done')}</p>
      )}
    </div>
  );
}

/**
 * trace items (PRD §5.4): draw the character stroke by stroke over a faint guide; each stroke is
 * checked for direction, order and rough shape. Two misses or fewer counts as correct. A keyboard
 * alternative names the next stroke instead.
 */
export function TraceCheck({ item, solved, onDone }: Props) {
  const { t } = useT();
  const data = useStrokes(item.char);
  const [mode, setMode] = useState<'draw' | 'keys'>('draw');
  const [key, setKey] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  if (data === undefined) return <p className="text-small text-muted">{t('strokes.loading')}</p>;
  if (data === null) return <p className="text-small text-muted">{t('strokes.none')}</p>;

  const done = (misses: number) => {
    setResult(misses);
    onDone(misses);
  };

  return (
    <div className="flex flex-col items-center gap-3" data-trace>
      <p className="flex items-center gap-2 text-small text-muted">
        {t('trace.prompt')} <ZhText className="text-zh-body text-ink">{item.char}</ZhText>
      </p>
      {mode === 'draw' ? (
        <TracePad key={key} data={data} guide={item.guide === 'on'} onDone={done} disabled={solved} />
      ) : (
        <StrokeQuiz key={key} char={item.char} onDone={done} />
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {result !== null && result > 2 && !solved && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setResult(null);
              setKey((k) => k + 1);
            }}
          >
            {t('trace.again')}
          </button>
        )}
        <button type="button" className="btn btn-quiet" onClick={() => setMode(mode === 'draw' ? 'keys' : 'draw')} aria-pressed={mode === 'keys'}>
          {mode === 'draw' ? t('trace.useKeys') : t('trace.useDraw')}
        </button>
      </div>
    </div>
  );
}
