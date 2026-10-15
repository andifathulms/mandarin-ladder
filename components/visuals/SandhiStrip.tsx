'use client';

import { useMemo, useState } from 'react';
import { alignPinyin } from '@/lib/zh/align';
import { sandhi, type SandhiSyllable } from '@/lib/zh/sandhi';
import { markSyllable } from '@/lib/zh/pinyin';
import { syllableKey } from '@/lib/speech/audio';
import { tonePath } from './ToneContour';
import type { VisualProps } from './types';
import { useRoving } from './useRoving';
import { pyDisplay } from '../zh/Pinyin';
import { ZhText } from '../zh/ZhText';
import { PlayButton } from '../lesson/PlayButton';
import { Segmented } from '../ui/Segmented';
import { usePlay } from '../useSpeech';
import { useReducedMotion, useT } from '../ProgressProvider';

/** Presets (DESIGN §8.4), in citation tones: the strip computes the spoken ones. */
export const SANDHI_PRESETS: { zh: string; py: string }[] = [
  { zh: '你好', py: 'nǐhǎo' },
  { zh: '很 好', py: 'hěn hǎo' },
  { zh: '不 是', py: 'bù shì' },
  { zh: '不 对', py: 'bù duì' },
  { zh: '一 个', py: 'yī gè' },
  { zh: '一 天', py: 'yī tiān' },
  { zh: '老鼠', py: 'lǎoshǔ' },
  { zh: '我 很 好', py: 'wǒ hěn hǎo' },
];

type Mode = 'written' | 'spoken';
type State = { preset: number; mode: Mode };
type Props = VisualProps<State> & { initial?: Partial<State>; presets?: number[] };

/**
 * SandhiStrip (DESIGN §8.4): a row of syllable cards with their written tones. Switch to "diucapkan"
 * and the tones that change lift, swap and settle into their spoken values, with the rule named.
 */
export function SandhiStrip({ state, interactive = true, onStateChange, initial, presets }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const play = usePlay();
  const list = (presets ?? SANDHI_PRESETS.map((_, i) => i)).map((i) => ({ i, ...SANDHI_PRESETS[i] }));
  const [own, setOwn] = useState<State>({ preset: initial?.preset ?? list[0].i, mode: initial?.mode ?? 'written' });
  const cur = state ?? own;
  const set = (patch: Partial<State>) => {
    const next = { ...cur, ...patch };
    setOwn(next);
    onStateChange?.(next);
  };
  const p = SANDHI_PRESETS[cur.preset];
  const syl = useMemo(() => sandhi(alignPinyin(p.zh, p.py)).flatMap((w) => w.syllables), [p]);
  const bases = useMemo(() => alignPinyin(p.zh, p.py).flatMap((w) => w.chars.map((c) => c.syl.base)), [p]);
  const rules = [...new Set(syl.map((s) => s.rule).filter(Boolean))] as NonNullable<SandhiSyllable['rule']>[];
  const roving = useRoving(
    list.map((x) => x.i),
    cur.preset,
    (preset) => set({ preset }),
  );
  const toneOf = (s: SandhiSyllable) => (cur.mode === 'spoken' ? s.spoken : s.written);
  const keys = bases.map((b, i) => (syl[i].written ? syllableKey(b, syl[i].written) : null)).filter((k): k is string => !!k);
  const playNow = async () => {
    if (cur.mode === 'spoken') await play(p.zh);
    else for (const k of keys) await play(k);
  };

  return (
    <div className="flex flex-col gap-4" data-visual="sandhi-strip">
      <div className="flex flex-wrap items-end gap-3" aria-live="polite">
        {syl.map((s, i) => {
          const tone = toneOf(s);
          const changed = cur.mode === 'spoken' && s.spoken !== s.written;
          return (
            <div
              key={`${cur.preset}-${i}`}
              className={`flex min-w-[76px] flex-col items-center gap-1 rounded-md border-2 bg-surface px-3 py-2 ${changed ? 'border-accent' : 'border-rule'}`}
              data-changed={changed || undefined}
            >
              <span lang="zh-Latn-pinyin" key={`${cur.mode}`} className={`py text-body tone-${tone} ${changed && !reduced ? 'sandhi-swap' : ''}`}>
                {pyDisplay(markSyllable(bases[i], tone))}
              </span>
              <ZhText className={`text-zh-body leading-none tone-${tone}`}>{s.ch}</ZhText>
              <svg viewBox="0 0 360 200" width={44} height={24} aria-hidden className={changed && !reduced ? 'sandhi-swap' : undefined}>
                <path d={tonePath(tone)} fill="none" style={{ stroke: `var(--tone-${tone})`, strokeWidth: tone === 0 ? 30 : 16, strokeLinecap: 'round' }} />
              </svg>
              <span className="font-mono text-small">{tone || '·'}</span>
            </div>
          );
        })}
        <PlayButton text={cur.mode === 'spoken' ? p.zh : (keys[0] ?? p.zh)} onPlay={() => void playNow()} label={t(cur.mode === 'spoken' ? 'nada.playSpoken' : 'nada.playWritten')} />
      </div>
      <p className="min-h-[1.5em] text-small">
        {cur.mode === 'spoken' && (rules.length ? rules.map((r) => t(`sandhi.rule.${r}`)).join(' ') : t('nada.same'))}
      </p>
      {interactive && (
        <>
          <Segmented<Mode>
            label={t('sandhi.mode')}
            value={cur.mode}
            onChange={(mode) => set({ mode })}
            options={[
              { value: 'written', label: t('nada.written') },
              { value: 'spoken', label: t('nada.spoken') },
            ]}
          />
          {list.length > 1 && (
            <div role="radiogroup" aria-label={t('sandhi.presets')} className="flex flex-wrap gap-2" onKeyDown={roving.onKeyDown}>
              {list.map((x, k) => (
                <button
                  key={x.i}
                  type="button"
                  {...roving.itemProps(x.i, k)}
                  className={`min-h-touch rounded-full border-2 px-4 ${x.i === cur.preset ? 'border-accent bg-accent-soft' : 'border-rule bg-surface'}`}
                >
                  <ZhText className="text-zh-small">{x.zh.replace(/\s+/g, '')}</ZhText>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
