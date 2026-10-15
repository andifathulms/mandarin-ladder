/** Visual ids lesson content may reference. Components live in components/visuals/registry.ts. */
export const VISUAL_IDS = [
  'tone-contour',
  'syllable-builder',
  'mouth-places',
  'sandhi-strip',
  'stroke-order',
  'character-parts',
  'place-scene-zh',
  'measure-words',
] as const;
export type VisualId = (typeof VISUAL_IDS)[number];
