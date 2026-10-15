'use client';

import { useState } from 'react';
import { useRoving } from './useRoving';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';
import { ZhSentence } from '../zh/ZhSentence';
import { useReducedMotion } from '../ProgressProvider';

export const OBJECTS = ['book', 'cat', 'cup', 'shirt', 'paper', 'person'] as const;
export type ShelfObject = (typeof OBJECTS)[number];

/** Each object's phrase and the nearest Indonesian classifier (marked with [[ ]] in both). */
export const PHRASE: Record<ShelfObject, { mw: string; zh: string; py: string; id: string; idWord: string }> = {
  book: { mw: '本', zh: '一 [[本]] 书', py: 'yì [[běn]] shū', id: 'se[[buah]] buku', idWord: 'buku' },
  cat: { mw: '只', zh: '一 [[只]] 猫', py: 'yì [[zhī]] māo', id: 'se[[ekor]] kucing', idWord: 'kucing' },
  cup: { mw: '杯', zh: '一 [[杯]] 茶', py: 'yì [[bēi]] chá', id: 'se[[cangkir]] teh', idWord: 'teh' },
  shirt: { mw: '件', zh: '一 [[件]] 衣服', py: 'yí [[jiàn]] yīfu', id: 'se[[helai]] baju', idWord: 'baju' },
  paper: { mw: '张', zh: '一 [[张]] 纸', py: 'yì [[zhāng]] zhǐ', id: 'se[[lembar]] kertas', idWord: 'kertas' },
  person: { mw: '个', zh: '一 [[个]] 人', py: 'yí [[gè]] rén', id: 'se[[orang]]', idWord: 'orang' },
};

// Illustration tones (DESIGN §8): top lightest, front base, side darkest.
const f = (fill: string) => ({ style: { fill } });

/** The six objects, drawn in the illustration system, centred on (0, 0) in a 70×70 box. */
function ObjectShape({ o }: { o: ShelfObject }) {
  switch (o) {
    case 'book':
      return (
        <g>
          <polygon points="-26,-6 18,-6 28,-14 -16,-14" {...f('var(--card-top)')} />
          <rect x="-26" y="-6" width="44" height="22" {...f('var(--accent)')} />
          <polygon points="18,-6 28,-14 28,8 18,16" {...f('color-mix(in srgb, var(--accent) 70%, var(--ink))')} />
          <rect x="-26" y="2" width="44" height="3" {...f('var(--card-top)')} />
        </g>
      );
    case 'cat':
      return (
        <g>
          <ellipse cx="0" cy="8" rx="20" ry="13" {...f('var(--wood)')} />
          <circle cx="-14" cy="-8" r="11" {...f('var(--wood)')} />
          <polygon points="-24,-14 -21,-26 -14,-17" {...f('var(--wood-dark)')} />
          <polygon points="-10,-17 -5,-26 -3,-12" {...f('var(--wood-dark)')} />
          <path d="M18,10 C30,6 30,-6 22,-10" fill="none" style={{ stroke: 'var(--wood-dark)', strokeWidth: 4, strokeLinecap: 'round' }} />
          <circle cx="-17" cy="-9" r="1.6" {...f('var(--ink)')} />
          <circle cx="-10" cy="-9" r="1.6" {...f('var(--ink)')} />
        </g>
      );
    case 'cup':
      return (
        <g>
          <ellipse cx="0" cy="-10" rx="15" ry="5" {...f('var(--card-side)')} />
          <path d="M-15,-10 L-12,16 C-8,20 8,20 12,16 L15,-10 Z" {...f('var(--surface)')} />
          <path d="M-15,-10 L-12,16 C-8,20 8,20 12,16 L15,-10" fill="none" style={{ stroke: 'var(--card-side)', strokeWidth: 1.5 }} />
          <ellipse cx="0" cy="-10" rx="12" ry="3.5" {...f('color-mix(in srgb, var(--subject) 55%, var(--wood))')} />
          <path d="M14,-4 C24,-4 24,10 13,10" fill="none" style={{ stroke: 'var(--card-side)', strokeWidth: 3 }} />
        </g>
      );
    case 'shirt':
      return (
        <g>
          <path d="M-12,-20 L-28,-10 L-22,0 L-16,-4 L-16,22 L16,22 L16,-4 L22,0 L28,-10 L12,-20 C8,-14 -8,-14 -12,-20 Z" {...f('var(--medium)')} />
          <path d="M-12,-20 C-8,-14 8,-14 12,-20" fill="none" style={{ stroke: 'color-mix(in srgb, var(--medium) 60%, var(--ink))', strokeWidth: 2 }} />
        </g>
      );
    case 'paper':
      return (
        <g>
          <polygon points="-22,14 18,14 26,-16 -14,-16" {...f('var(--surface)')} />
          <polygon points="-22,14 18,14 26,-16 -14,-16" fill="none" style={{ stroke: 'var(--card-side)', strokeWidth: 1.5 }} />
          {[-8, -2, 4].map((y) => (
            <line key={y} x1={-12 + (y + 16) * -0.25} y1={y} x2={14 + (y + 16) * -0.25} y2={y} style={{ stroke: 'var(--rule)', strokeWidth: 1.5 }} />
          ))}
        </g>
      );
    case 'person':
      return (
        <g>
          <circle cx="0" cy="-18" r="9" {...f('var(--wood)')} />
          <path d="M-14,22 L-12,-2 C-10,-8 10,-8 12,-2 L14,22 Z" {...f('var(--subject)')} />
        </g>
      );
  }
}

type Props = VisualProps<ShelfObject> & { initial?: ShelfObject };

/**
 * MeasureWords (DESIGN §8.8): objects on a wooden shelf. Picking one lifts it and shows its measure
 * word phrase (一本书) with ruby, with the Indonesian classifier beneath (sebuah buku, seekor kucing);
 * where Indonesian has none, or a different one, the note says so.
 */
export function MeasureWords({ state, interactive = true, onStateChange, lang, initial }: Props) {
  const reduced = useReducedMotion();
  const { measureWords } = useVisualData();
  const [own, setOwn] = useState<ShelfObject>(initial ?? 'book');
  const cur = state ?? own;
  const set = (o: ShelfObject) => {
    setOwn(o);
    onStateChange?.(o);
  };
  const roving = useRoving(OBJECTS, cur, set);
  const ph = PHRASE[cur];
  const note = measureWords.find((m) => m.mw === ph.mw)?.note;
  const idParts = ph.id.split(/\[\[|\]\]/);

  return (
    <div className="flex flex-col gap-4" data-visual="measure-words">
      <svg viewBox="0 0 480 150" className="h-auto w-full" role="img" aria-label={`${ph.zh.replace(/\[\[|\]\]|\s/g, '')}: ${ph.id.replace(/\[\[|\]\]/g, '')}`}>
        {/* Shelf */}
        <rect x="10" y="110" width="460" height="10" {...f('var(--wood)')} />
        <polygon points="10,110 470,110 462,102 18,102" {...f('color-mix(in srgb, var(--wood) 70%, var(--card-top))')} />
        <rect x="10" y="120" width="460" height="4" {...f('var(--wood-dark)')} />
        {OBJECTS.map((o, i) => {
          const lifted = o === cur;
          const x = 45 + i * 78;
          return (
            <g
              key={o}
              style={{
                transform: `translate(${x}px, ${lifted ? 66 : 78}px)`,
                transition: reduced ? 'none' : 'transform var(--m-object-d) var(--ease-object)',
              }}
            >
              <ellipse cx="0" cy={lifted ? 32 : 22} rx={lifted ? 18 : 24} ry="3.5" style={{ fill: 'var(--ink)', opacity: 0.1 }} />
              <ObjectShape o={o} />
            </g>
          );
        })}
      </svg>
      <div className="flex flex-col gap-1">
        <ZhSentence zh={ph.zh} py={ph.py} size="sentence" wordSheet={false} />
        <p lang="id" className="id-text text-body">
          {idParts.map((p, i) => (i % 2 ? <strong key={i} className="font-bold not-italic text-accent">{p}</strong> : <span key={i}>{p}</span>))}
        </p>
        {note && <p className="text-small text-muted">{note[lang]}</p>}
      </div>
      {interactive && (
        <div role="radiogroup" aria-label={lang === 'en' ? 'Choose a thing' : 'Pilih benda'} className="flex flex-wrap gap-2" onKeyDown={roving.onKeyDown}>
          {OBJECTS.map((o, i) => (
            <button
              key={o}
              type="button"
              {...roving.itemProps(o, i)}
              aria-label={`${PHRASE[o].zh.replace(/\[\[|\]\]|\s/g, '')}, ${PHRASE[o].idWord}`}
              className={`min-h-touch rounded-full border-2 px-4 ${o === cur ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'}`}
            >
              <span lang="id">{PHRASE[o].idWord}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
