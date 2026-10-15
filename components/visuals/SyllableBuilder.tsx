'use client';

import { useState } from 'react';
import { FINAL_GROUPS, INITIAL_GROUPS, isValidSyllable, spell } from '@/lib/zh/syllables';
import { markIndex, markSyllable, type Tone } from '@/lib/zh/pinyin';
import { syllableKey } from '@/lib/speech/audio';
import { tonePath } from './ToneContour';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';
import { pyDisplay } from '../zh/Pinyin';
import { ZhSentence } from '../zh/ZhSentence';
import { PlayButton } from '../lesson/PlayButton';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';

type State = { initial: string; final: string; tone: Tone };
type Props = VisualProps<State> & { initial?: State };

/** Which tone-mark rule applies to a spelled syllable (DESIGN §8.2). */
export function markRule(base: string): 'ae' | 'ou' | 'last' {
  const i = markIndex(base);
  if (/[ae]/.test(base) && 'ae'.includes(base[i])) return 'ae';
  if (base.includes('ou') && base[i] === 'o') return 'ou';
  return 'last';
}

const Chip = ({ on, label, onClick, lang }: { on: boolean; label: string; onClick: () => void; lang?: string }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={onClick}
    lang={lang}
    className={`min-h-touch min-w-touch rounded-full border-2 px-3 font-body transition-colors duration-quick ${on ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink hover:border-accent'}`}
  >
    {label}
  </button>
);

/**
 * SyllableBuilder (DESIGN §8.2): pick an initial, a final and a tone. The syllable assembles with the
 * tone mark on the right vowel and the rule beneath; it plays if it exists, with a real word that uses
 * it. Combinations Mandarin doesn't have are greyed with a note.
 */
export function SyllableBuilder({ state, interactive = true, onStateChange, initial }: Props) {
  const { t } = useT();
  const play = usePlay();
  const { syllables: table, examples } = useVisualData();
  const [own, setOwn] = useState<State>(initial ?? { initial: 'm', final: 'a', tone: 3 });
  const cur = state ?? own;
  const set = (patch: Partial<State>) => {
    const next = { ...cur, ...patch };
    setOwn(next);
    onStateChange?.(next);
  };
  const base = spell(cur.initial, cur.final);
  const valid = isValidSyllable(base);
  const tonesHere = table.find((r) => r.b === base)?.t ?? [1, 2, 3, 4];
  const toneExists = valid && (cur.tone === 0 || tonesHere.includes(cur.tone));
  const marked = markSyllable(base, cur.tone);
  const key = cur.tone ? syllableKey(base, cur.tone) : null;
  const example = examples[`${base}${cur.tone}`];
  const rule = markRule(base);

  return (
    <div className="flex flex-col gap-5" data-visual="syllable-builder">
      <div className="flex flex-col items-center gap-2 rounded-md bg-surface px-4 py-5">
        <p className="flex items-center gap-3">
          <span
            lang="zh-Latn-pinyin"
            className={`py text-[3.4rem] font-medium leading-none ${toneExists ? `tone-${cur.tone}` : 'text-muted'}`}
            aria-live="polite"
            data-syllable={base}
          >
            {pyDisplay(marked)}
          </span>
          {toneExists && key && <PlayButton text={key} onPlay={() => void play(key)} label={t('audio.playText', { text: marked })} />}
        </p>
        {valid && cur.tone !== 0 && <p className="text-small text-muted">{t(`builder.rule.${rule}`)}</p>}
        {!valid && <p className="text-small text-muted">{t('builder.none')}</p>}
        {valid && !toneExists && <p className="text-small text-muted">{t('builder.noTone')}</p>}
        {toneExists && example && (
          <div className="flex items-baseline gap-2">
            <span className="label text-muted">{t('builder.example')}</span>
            <ZhSentence zh={example.zh} py={example.py} size="small" play={false} showPinyin wordSheet={false} />
          </div>
        )}
      </div>
      {interactive && (
        <div className="grid gap-4 min-[640px]:grid-cols-3">
          <fieldset className="flex flex-col gap-2">
            <legend className="eyebrow mb-1">{t('builder.initials')}</legend>
            <div className="flex flex-wrap gap-1">
              <Chip on={cur.initial === ''} label="∅" onClick={() => set({ initial: '' })} />
            </div>
            {INITIAL_GROUPS.map((g) => (
              <div key={g.id} className="flex flex-col gap-1">
                <span className="label text-muted">{t(`place.${g.id as 'lips'}`)}</span>
                <div className="flex flex-wrap gap-1">
                  {g.initials.map((i) => (
                    <Chip key={i} on={cur.initial === i} label={i} lang="zh-Latn-pinyin" onClick={() => set({ initial: i })} />
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="eyebrow mb-1">{t('builder.finals')}</legend>
            {FINAL_GROUPS.map((g) => (
              <div key={g.id} className="flex flex-wrap gap-1">
                {g.finals.map((f) => (
                  <Chip key={f} on={cur.final === f} label={f} lang="zh-Latn-pinyin" onClick={() => set({ final: f })} />
                ))}
              </div>
            ))}
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="eyebrow mb-1">{t('builder.tones')}</legend>
            <div className="flex flex-wrap gap-1">
              {([1, 2, 3, 4, 0] as Tone[]).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  aria-pressed={cur.tone === tone}
                  aria-label={t('tone.n', { n: tone || t('tone.neutral') })}
                  onClick={() => set({ tone })}
                  className={`flex min-h-touch min-w-[56px] flex-col items-center rounded-md border-2 px-2 py-1 ${cur.tone === tone ? 'border-accent bg-accent-soft' : 'border-rule bg-surface'}`}
                >
                  <svg viewBox="0 0 360 200" width={40} height={22} aria-hidden>
                    <path d={tonePath(tone)} fill="none" style={{ stroke: `var(--tone-${tone})`, strokeWidth: tone === 0 ? 30 : 16, strokeLinecap: 'round' }} />
                  </svg>
                  <span className="font-mono text-small">{tone || '·'}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
