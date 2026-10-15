'use client';

import { useState } from 'react';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';
import { ZhText } from '../zh/ZhText';
import { Pinyin } from '../zh/Pinyin';
import { useReducedMotion, useT } from '../ProgressProvider';

/** Positions of the top-level parts for each layout (Ideographic Description Characters). */
type Pos = 'left' | 'right' | 'top' | 'bottom' | 'middle' | 'outside' | 'inside' | 'part';
const POSITIONS: Record<string, Pos[]> = {
  '⿰': ['left', 'right'],
  '⿱': ['top', 'bottom'],
  '⿲': ['left', 'middle', 'right'],
  '⿳': ['top', 'middle', 'bottom'],
  '⿴': ['outside', 'inside'],
  '⿵': ['outside', 'inside'],
  '⿶': ['outside', 'inside'],
  '⿷': ['outside', 'inside'],
  '⿸': ['outside', 'inside'],
  '⿹': ['outside', 'inside'],
  '⿺': ['outside', 'inside'],
  '⿻': ['part', 'part'],
};

type State = { split: boolean; part: string | null };
type Props = VisualProps<State> & { char: string; initial?: Partial<State>; onPick?: (ch: string) => void };

/**
 * CharacterParts (DESIGN §8.6): the character at glyph size. Pisahkan (split) slides its components
 * apart, each labelled with its meaning role, its sound role, or its position; the radical has a
 * --dasar outline. Tapping a component shows other characters that share it, each tappable.
 */
export function CharacterParts({ char: start, state, interactive = true, onStateChange, initial, lang }: Props) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const { hanzi, family } = useVisualData();
  const [char, setChar] = useState(start);
  const [own, setOwn] = useState<State>({ split: initial?.split ?? false, part: initial?.part ?? null });
  const cur = state ?? own;
  const set = (patch: Partial<State>) => {
    const next = { ...cur, ...patch };
    setOwn(next);
    onStateChange?.(next);
  };
  const h = hanzi[char];
  if (!h) {
    return (
      <ZhText as="p" className="text-zh-glyph text-center" data-visual="character-parts">
        {char}
      </ZhText>
    );
  }
  const vertical = h.layout === '⿱' || h.layout === '⿳';
  const pos: Pos[] = (h.layout && POSITIONS[h.layout]) || h.parts.map(() => 'part' as const);
  const gap = cur.split ? (reduced ? 0 : 1) : 0;
  const shared = cur.part ? (family[cur.part] ?? []).filter((c) => c !== char) : [];

  return (
    <div className="flex flex-col items-center gap-4" data-visual="character-parts">
      <div
        className={`tianzige flex min-h-[160px] min-w-[160px] items-center justify-center rounded-md bg-surface p-4 ${vertical ? 'flex-col' : 'flex-row'}`}
        role="img"
        aria-label={
          cur.split && h.parts.length
            ? `${char} = ${h.parts.map((p, i) => `${p.part} (${t(`parts.pos.${pos[i] ?? 'part'}`)}${p.label ? `, ${p.label[lang]}` : ''}${p.role === 'sound' && p.py ? `, ${t('parts.sound')} ${p.py}` : ''})`).join(' + ')}`
            : char
        }
      >
        {cur.split && h.parts.length ? (
          h.parts.map((p, i) => (
            <span
              key={`${p.part}${i}`}
              className="flex flex-col items-center"
              style={{
                margin: gap ? (vertical ? '8px 0' : '0 12px') : 0,
                transition: 'margin var(--m-object-d) var(--ease-object)',
              }}
            >
              <ZhText
                className={`text-[3.6rem] leading-none ${p.part === h.radical ? 'rounded-sm' : ''}`}
                style={p.part === h.radical ? { boxShadow: '0 0 0 2px var(--dasar)', padding: '0 4px' } : undefined}
              >
                {p.part}
              </ZhText>
            </span>
          ))
        ) : (
          <ZhText className="text-zh-glyph font-medium leading-none">{char}</ZhText>
        )}
      </div>
      {cur.split && h.parts.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2">
          {h.parts.map((p, i) => (
            <li key={`${p.part}${i}`}>
              <button
                type="button"
                disabled={!interactive}
                onClick={() => set({ part: cur.part === p.part ? null : p.part })}
                aria-pressed={cur.part === p.part}
                className={`flex min-h-touch flex-col items-start rounded-md border-2 px-3 py-1 text-start ${cur.part === p.part ? 'border-accent bg-accent-soft' : 'border-rule bg-surface'}`}
              >
                <span className="flex items-baseline gap-2">
                  <ZhText className="text-zh-small">{p.part}</ZhText>
                  <span className="label text-muted">{t(`parts.pos.${pos[i] ?? 'part'}`)}</span>
                  {p.part === h.radical && <span className="label text-dasar">{t('hanzi.radical')}</span>}
                </span>
                <span className="text-small">
                  {p.role === 'sound' && p.py ? (
                    <>
                      {t('parts.sound')}: <Pinyin text={p.py} />
                    </>
                  ) : p.label ? (
                    <>
                      {p.role === 'meaning' ? `${t('parts.meaning')}: ` : ''}
                      {p.label[lang]}
                    </>
                  ) : (
                    <span className="text-muted">{t('parts.part')}</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {h.note && cur.split && <p className="text-small text-muted">{h.note[lang]}</p>}
      {shared.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-small text-muted">{t('parts.shared', { part: cur.part ?? '' })}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {shared.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  if (!hanzi[c]) return;
                  setChar(c);
                  set({ part: null });
                }}
                disabled={!hanzi[c]}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-sm border-2 border-rule bg-surface hover:border-accent disabled:opacity-100"
              >
                <ZhText className="text-zh-body leading-none">{c}</ZhText>
              </button>
            ))}
          </div>
        </div>
      )}
      {interactive && h.parts.length > 0 && (
        <button type="button" className="btn btn-primary" aria-pressed={cur.split} onClick={() => set({ split: !cur.split, part: null })}>
          {cur.split ? t('parts.join') : t('parts.split')}
        </button>
      )}
    </div>
  );
}
