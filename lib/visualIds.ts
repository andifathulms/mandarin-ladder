/** Visual ids lesson content may reference. Components live in components/visuals/registry.ts. */
export const VISUAL_IDS = [
  'letter-forms',
  'word-joiner',
  'harakat-builder',
  'makhraj',
  'sun-moon',
  'place-scene-ar',
  'agreement',
] as const;
export type VisualId = (typeof VISUAL_IDS)[number];
