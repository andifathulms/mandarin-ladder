'use client';

import { useMemo, useState } from 'react';
import type { MakhrajPoint } from '@/lib/types';
import { ArIsland } from '../ar/ArIsland';
import { usePlay } from '../useSpeech';
import { useVisualData } from './VisualData';
import type { VisualProps } from './types';

export const PAIRS: [string, string][] = [
  ['ع', 'ء'],
  ['ح', 'ه'],
  ['خ', 'ك'],
  ['ق', 'ك'],
  ['ث', 'س'],
  ['ص', 'س'],
  ['ذ', 'ز'],
  ['ظ', 'ز'],
  ['ض', 'د'],
  ['ط', 'ت'],
];

/**
 * An original, stylised side section (lips on the left, throat on the right). Flat fills in the card
 * tones, the tongue in --subject at 60% as the moving part. No anatomy detail: only front, middle,
 * back and the three bands of the throat. viewBox 240×180, matching content/data/makhraj.yaml.
 */
function Section({ compact = false }: { compact?: boolean }) {
  const f = (fill: string, extra: React.CSSProperties = {}) => ({ style: { fill, ...extra } });
  return (
    <g>
      {/* throat: three bands, upper to lower */}
      <rect x="140" y="88" width="26" height="30" rx="4" {...f('var(--card-top)')} />
      <rect x="142" y="118" width="24" height="24" {...f('var(--card)')} />
      <rect x="144" y="142" width="22" height="34" rx="4" {...f('var(--card-side)')} />
      {/* roof of the mouth: hard palate to soft palate */}
      <path d="M40 84 Q60 66 100 62 Q126 60 138 72 Q146 80 142 92" fill="none" style={{ stroke: 'var(--card-side)', strokeWidth: 7, strokeLinecap: 'round' }} />
      {/* mouth floor and jaw */}
      <path d="M44 112 Q70 126 108 124 Q132 122 142 112" fill="none" style={{ stroke: 'var(--card)', strokeWidth: 7, strokeLinecap: 'round' }} />
      {/* tongue: one shape */}
      <path d="M50 98 Q58 88 78 86 Q104 80 124 86 Q140 92 140 108 Q138 118 120 120 Q86 122 62 112 Q50 106 50 98 Z" {...f('var(--subject)', { opacity: 0.6 })} />
      {/* teeth and lips */}
      <rect x="38" y="84" width="7" height="9" rx="2" {...f('var(--surface)', { stroke: 'var(--card-side)', strokeWidth: 1.5 })} />
      <rect x="40" y="101" width="7" height="8" rx="2" {...f('var(--surface)', { stroke: 'var(--card-side)', strokeWidth: 1.5 })} />
      <ellipse cx="27" cy="90" rx="9" ry="6" {...f('var(--card-top)', { stroke: 'var(--card-side)', strokeWidth: 1.5 })} />
      <ellipse cx="29" cy="104" rx="9" ry="6" {...f('var(--card-top)', { stroke: 'var(--card-side)', strokeWidth: 1.5 })} />
      {!compact && (
        <ellipse cx="96" cy="176" rx="80" ry="3" style={{ fill: 'var(--ink)', opacity: 0.08 }} />
      )}
    </g>
  );
}

function Glow({ p }: { p: MakhrajPoint }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={14} style={{ fill: 'var(--accent)', opacity: 0.25 }} />
      <circle cx={p.x} cy={p.y} r={14} fill="none" style={{ stroke: 'var(--accent)', strokeWidth: 2 }} />
    </g>
  );
}

type Props = VisualProps<string> & { pair?: [string, string] };

/** Makhraj (DESIGN §8.4): compare where two sounds are made. */
export function Makhraj({ pair, interactive = true, lang }: Props) {
  const { letters, makhraj } = useVisualData();
  const play = usePlay();
  const start = pair && PAIRS.some(([a, b]) => a === pair[0] && b === pair[1]) ? pair : PAIRS[0];
  const [cur, setCur] = useState<[string, string]>(start);
  const point = useMemo(() => new Map(makhraj.map((m) => [m.id, m])), [makhraj]);
  const of = (c: string) => {
    const l = letters.find((x) => x.letter === c);
    return l ? { l, p: point.get(l.makhraj) } : null;
  };
  const both = cur.map(of);
  const labelOf = (x: ReturnType<typeof of>) => (x?.p ? (lang === 'en' ? x.p.label_en : x.p.label_id) : '');
  const alt = both.map((x, i) => `${cur[i]} ${x?.l.name_id ?? ''}: ${labelOf(x)}`).join('; ');

  return (
    <div className="flex flex-col gap-4" data-visual="makhraj">
      <svg viewBox="0 0 240 180" className="h-auto w-full max-w-[520px] self-center" role="img" aria-label={alt}>
        <Section />
        {both.map((x, i) => x?.p && <Glow key={i} p={x.p} />)}
      </svg>
      <ul className="flex flex-col gap-1">
        {both.map((x, i) => (
          <li key={i} className="flex items-center gap-3">
            <ArIsland face="display" className="text-ar-title leading-none">
              {cur[i]}
            </ArIsland>
            <span className="label text-muted">{labelOf(x)}</span>
            <button type="button" className="btn btn-quiet min-h-touch px-3 text-small" onClick={() => void play(cur[i] + 'َ')}>
              {lang === 'en' ? 'Play' : 'Putar'}
            </button>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>
      {interactive && (
        <div className="flex flex-wrap gap-2" role="group" aria-label={lang === 'en' ? 'Sound pairs' : 'Pasangan bunyi'}>
          {PAIRS.map((pr) => {
            const on = pr[0] === cur[0] && pr[1] === cur[1];
            return (
              <button
                key={pr.join('')}
                type="button"
                aria-pressed={on}
                onClick={() => setCur(pr)}
                className={`min-h-touch rounded-full border-2 px-4 transition-colors duration-quick ${on ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'}`}
              >
                <ArIsland face="ui" className="text-ar-small leading-none">
                  {pr[0]} / {pr[1]}
                </ArIsland>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** A 120×90 thumbnail for Bunyi cards: where one or two consonants are made. */
export function MakhrajThumb({ letters: show }: { letters: string[] }) {
  const { letters, makhraj } = useVisualData();
  const point = new Map(makhraj.map((m) => [m.id, m]));
  const pts = show.map((c) => point.get(letters.find((l) => l.letter === c)?.makhraj ?? '')).filter(Boolean) as MakhrajPoint[];
  if (!pts.length) return null;
  return (
    <svg viewBox="10 50 170 120" width={120} height={90} aria-hidden focusable={false} className="shrink-0 rounded-md bg-surface">
      <Section compact />
      {pts.map((p, i) => (
        <Glow key={i} p={p} />
      ))}
    </svg>
  );
}
