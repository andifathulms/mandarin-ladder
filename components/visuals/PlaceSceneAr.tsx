'use client';

import { PLACE_SPEC, PLACES, isPlace, type Place } from './placeLogic';
import { PlaceDrawing, usePlace } from './PlaceScene';
import { useRoving } from './useRoving';
import { ArSentence } from '../ar/ArSentence';
import { ArIsland } from '../ar/ArIsland';
import type { VisualProps } from './types';

/** Arabic prepositions of place for each position, with their transliteration. */
export const PREP: Record<Place, { ar: string; tr: string }> = {
  in: { ar: 'فِي', tr: 'fī' },
  on: { ar: 'عَلَى', tr: 'ʿalā' },
  under: { ar: 'تَحْتَ', tr: 'taḥta' },
  'next to': { ar: 'بِجَانِبِ', tr: 'bijānibi' },
  behind: { ar: 'خَلْفَ', tr: 'khalfa' },
  'in front of': { ar: 'أَمَامَ', tr: 'amāma' },
};

/** الكُرَةُ ___ الصُّنْدُوقِ / الطَّاوِلَةِ: the sentence for a place, with the preposition in focus. */
export function placeSentenceAr(p: Place): { ar: string; tr: string; id: string } {
  const s = PLACE_SPEC[p];
  const table = s.ref === 'table';
  const obj = table ? { ar: 'الطَّاوِلَةِ', tr: 'ṭ-ṭāwilati', id: 'meja' } : { ar: 'الصُّنْدُوقِ', tr: 'ṣ-ṣundūqi', id: 'kotak' };
  return {
    ar: `الكُرَةُ [[${PREP[p].ar}]] ${obj.ar}.`,
    tr: `al-kuratu [[${PREP[p].tr}]] ${obj.tr}.`,
    id: `Bolanya ${s.id} ${obj.id}.`,
  };
}

type Props = VisualProps<Place> & { initial?: Place };

/** PlaceScene, Arabic (DESIGN §8.6): English Ladder's scene with Arabic prepositions and sentences. */
export function PlaceSceneAr({ state, interactive = true, onStateChange, lang, initial }: Props) {
  const { place, from, set } = usePlace(isPlace(initial) ? initial : 'on', state, onStateChange);
  // The prepositions read right to left, so arrow keys follow the visual row.
  const roving = useRoving(PLACES, place, set, 'rtl');
  const sentence = placeSentenceAr(place);
  const alt = `${sentence.ar.replace(/\[\[|\]\]/g, '')} ${sentence.id}`;
  const label = (en: string, ar: string, id: string) => (
    <>
      <tspan lang="en">{en}</tspan> · <tspan lang="ar" className="font-ar-ui">{ar}</tspan> · <tspan lang="id" fontStyle="italic">{id}</tspan>
    </>
  );

  return (
    <div className="flex flex-col gap-4" data-visual="place-scene-ar">
      <PlaceDrawing
        place={place}
        from={from}
        alt={alt}
        labels={{ table: label('table', 'طاولة', 'meja'), box: label('box', 'صندوق', 'kotak') }}
      />
      <p className="sr-only" aria-live="polite">
        {alt}
      </p>
      {interactive && (
        <>
          <div
            role="radiogroup"
            aria-label={lang === 'en' ? 'Where is the ball?' : 'Di mana bolanya?'}
            dir="rtl"
            className="flex flex-wrap gap-2"
            onKeyDown={roving.onKeyDown}
          >
            {PLACES.map((p, i) => (
              <button
                key={p}
                type="button"
                {...roving.itemProps(p, i)}
                aria-label={`${PREP[p].tr}, ${PLACE_SPEC[p].id}`}
                className={`min-h-touch rounded-full border-2 px-4 transition-colors duration-quick ${
                  p === place ? 'border-accent bg-accent text-accent-ink' : 'border-rule bg-surface text-ink'
                }`}
              >
                <ArIsland className="text-ar-small leading-none">{PREP[p].ar}</ArIsland>
              </button>
            ))}
          </div>
          <ArSentence ar={sentence.ar} tr={sentence.tr} id={sentence.id} />
        </>
      )}
    </div>
  );
}
