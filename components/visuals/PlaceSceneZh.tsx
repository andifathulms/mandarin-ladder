'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { PLACE_SPEC, PLACES, isPlace, type Place } from './placeLogic';
import { PlaceDrawing, usePlace } from './PlaceScene';
import { useRoving } from './useRoving';
import type { VisualProps } from './types';
import { ZhSentence } from '../zh/ZhSentence';
import { ZhText } from '../zh/ZhText';
import { pyDisplay } from '../zh/Pinyin';
import { Toggle } from '../ui/Toggle';
import { useT } from '../ProgressProvider';

/** Localisers for each position (DESIGN §8.7), and the Indonesian preposition. */
export const LOCALISER: Record<Place, { zh: string; py: string; id: string }> = {
  on: { zh: '上', py: 'shang', id: 'atas' },
  under: { zh: '下', py: 'xia', id: 'bawah' },
  in: { zh: '里', py: 'li', id: 'dalam' },
  'next to': { zh: '旁边', py: 'pángbiān', id: 'sebelah' },
  behind: { zh: '后面', py: 'hòumiàn', id: 'belakang' },
  'in front of': { zh: '前面', py: 'qiánmiàn', id: 'depan' },
};

/** 球在盒子上。 / 球在桌子下。: the sentence for a place, with the localiser in focus. */
export function placeSentenceZh(p: Place): { zh: string; py: string; id: string; words: { zh: string; id: string }[] } {
  const table = PLACE_SPEC[p].ref === 'table';
  const obj = table ? { zh: '桌子', py: 'zhuōzi', id: 'meja' } : { zh: '盒子', py: 'hézi', id: 'kotak' };
  const loc = LOCALISER[p];
  return {
    zh: `球 在 ${obj.zh} [[${loc.zh}]] 。`,
    py: `qiú zài ${obj.py} [[${loc.py}]] .`,
    id: `Bolanya di ${loc.id} ${obj.id}.`,
    // Chinese order, each with its Indonesian partner: the localiser comes after the noun.
    words: [
      { zh: '球', id: 'Bola' },
      { zh: '在', id: 'di' },
      { zh: obj.zh, id: obj.id },
      { zh: loc.zh, id: loc.id },
    ],
  };
}

/** Chinese words above their Indonesian partners, joined by lines: the localiser jumps to the end. */
function Compare({ words }: { words: { zh: string; id: string }[] }) {
  const box = useRef<HTMLDivElement>(null);
  const top = useRef<(HTMLSpanElement | null)[]>([]);
  const bottom = useRef<(HTMLSpanElement | null)[]>([]);
  const [lines, setLines] = useState<{ x1: number; x2: number; focus: boolean }[]>([]);
  // Indonesian order: Bola di [atas] [kotak].
  const idOrder = [0, 1, 3, 2];
  useLayoutEffect(() => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return;
    setLines(
      words.map((_, i) => {
        const a = top.current[i]?.getBoundingClientRect();
        const c = bottom.current[idOrder.indexOf(i)]?.getBoundingClientRect();
        return { x1: a ? a.left + a.width / 2 - b.left : 0, x2: c ? c.left + c.width / 2 - b.left : 0, focus: i === 3 };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);
  return (
    <div ref={box} className="relative flex flex-col gap-8 rounded-md bg-surface px-4 py-3" data-compare>
      <div className="flex justify-around gap-2">
        {words.map((w, i) => (
          <span key={i} ref={(el) => {
            top.current[i] = el;
          }} className={i === 3 ? 'zh-focus' : undefined}>
            <ZhText className="text-zh-body">{w.zh}</ZhText>
          </span>
        ))}
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {lines.map((l, i) => (
          <line key={i} x1={l.x1} y1="52%" x2={l.x2} y2="64%" style={{ stroke: l.focus ? 'var(--accent)' : 'var(--rule)', strokeWidth: l.focus ? 2 : 1.5 }} />
        ))}
      </svg>
      <div className="flex justify-around gap-2" lang="id">
        {idOrder.map((k, j) => (
          <span key={j} ref={(el) => {
            bottom.current[j] = el;
          }} className={`id-text ${k === 3 ? 'focus-word not-italic' : ''}`}>
            {words[k].id}
          </span>
        ))}
      </div>
    </div>
  );
}

type Props = VisualProps<Place> & { initial?: Place };

/**
 * PlaceScene, Chinese (DESIGN §8.7): English Ladder's table, box and ball (the ball in jade) with the
 * localisers 上 下 里 旁边 后面 前面. "Bandingkan dengan Indonesia" aligns the sentence word by word
 * with the Indonesian, so the localiser's jump to the end is visible.
 */
export function PlaceSceneZh({ state, interactive = true, onStateChange, lang, initial }: Props) {
  const { t } = useT();
  const { place, from, set } = usePlace(isPlace(initial) ? initial : 'on', state, onStateChange);
  const roving = useRoving(PLACES, place, set);
  const [compare, setCompare] = useState(false);
  const s = placeSentenceZh(place);
  const alt = `${s.zh.replace(/\[\[|\]\]|\s/g, '')} ${s.id}`;
  const label = (zh: string, py: string, id: string) => (
    <>
      <tspan lang="zh-Hans" className="font-zh-ui">
        {zh}
      </tspan>{' '}
      <tspan lang="zh-Latn-pinyin">{pyDisplay(py)}</tspan> · <tspan lang="id" fontStyle="italic">{id}</tspan>
    </>
  );

  return (
    <div className="flex flex-col gap-4" data-visual="place-scene-zh">
      <PlaceDrawing place={place} from={from} alt={alt} labels={{ table: label('桌子', 'zhuōzi', 'meja'), box: label('盒子', 'hézi', 'kotak') }} />
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>
      {interactive && (
        <>
          <div role="radiogroup" aria-label={lang === 'en' ? 'Where is the ball?' : 'Di mana bolanya?'} className="flex flex-wrap gap-2" onKeyDown={roving.onKeyDown}>
            {PLACES.map((p, i) => (
              <button
                key={p}
                type="button"
                {...roving.itemProps(p, i)}
                aria-label={`${LOCALISER[p].zh} ${LOCALISER[p].py}, ${PLACE_SPEC[p].id}`}
                className={`flex min-h-touch flex-col items-center rounded-full border-2 px-4 py-1 transition-colors duration-quick ${
                  p === place ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'
                }`}
              >
                <ZhText className="text-zh-small leading-none">{LOCALISER[p].zh}</ZhText>
                <span lang="zh-Latn-pinyin" className="text-small leading-none">
                  {pyDisplay(LOCALISER[p].py)}
                </span>
              </button>
            ))}
          </div>
          <ZhSentence zh={s.zh} py={s.py} id={s.id} wordSheet={false} />
          <Toggle label={t('place.compare')} checked={compare} onChange={setCompare} onLabel={t('settings.on')} offLabel={t('settings.off')} />
          {compare && <Compare words={s.words} />}
        </>
      )}
    </div>
  );
}
