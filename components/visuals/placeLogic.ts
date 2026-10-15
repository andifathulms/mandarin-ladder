export const PLACES = ['in', 'on', 'under', 'next to', 'behind', 'in front of'] as const;
export type Place = (typeof PLACES)[number];

/**
 * Draw-order slots, back to front:
 *  under  — below the table, drawn before the table top
 *  behind — on the table, drawn before the box
 *  inside — drawn between the box's back and its see-through front
 *  front  — drawn after everything
 */
export type Slot = 'under' | 'behind' | 'inside' | 'front';

export const BALL_R = 14;

type Spec = { x: number; y: number; slot: Slot; ref: 'table' | 'box'; id: string; lifted: boolean };

// Ball centres in the 400×260 scene (see PlaceScene for the geometry).
export const PLACE_SPEC: Record<Place, Spec> = {
  in: { x: 190, y: 138, slot: 'inside', ref: 'box', id: 'di dalam', lifted: false },
  on: { x: 200, y: 102, slot: 'front', ref: 'box', id: 'di atas', lifted: true },
  under: { x: 180, y: 230, slot: 'under', ref: 'table', id: 'di bawah', lifted: false },
  'next to': { x: 286, y: 140, slot: 'front', ref: 'box', id: 'di sebelah', lifted: false },
  behind: { x: 250, y: 112, slot: 'behind', ref: 'box', id: 'di belakang', lifted: false },
  'in front of': { x: 190, y: 152, slot: 'front', ref: 'box', id: 'di depan', lifted: false },
};

export const isPlace = (v: unknown): v is Place => PLACES.includes(v as Place);

export function placeSentence(p: Place): { en: string; id: string } {
  const s = PLACE_SPEC[p];
  const objEn = s.ref === 'table' ? 'table' : 'box';
  const objId = s.ref === 'table' ? 'meja' : 'kotak';
  return { en: `The ball is [[${p}]] the ${objEn}.`, id: `Bolanya ${s.id} ${objId}.` };
}

export function placeAlt(p: Place, lang: 'id' | 'en'): string {
  const s = PLACE_SPEC[p];
  return lang === 'en'
    ? `The ball is ${p} the ${s.ref}.`
    : `Bola ada ${s.id} ${s.ref === 'table' ? 'meja' : 'kotak'}.`;
}
