import type { ComponentType } from 'react';
import type { VisualId } from '@/lib/visualIds';
import { StrokeOrder } from './StrokeOrder';
import { ToneContour } from './ToneContour';
import { SyllableBuilder } from './SyllableBuilder';
import { MouthPlaces } from './MouthPlaces';
import { SandhiStrip } from './SandhiStrip';
import { CharacterParts } from './CharacterParts';
import { PlaceSceneZh } from './PlaceSceneZh';
import { MeasureWords } from './MeasureWords';

/** Visual id → component. Lesson frontmatter refers to visuals by id only. */
// Each visual takes VisualProps plus its own props from frontmatter.
export const registry = {
  'tone-contour': ToneContour,
  'syllable-builder': SyllableBuilder,
  'mouth-places': MouthPlaces,
  'sandhi-strip': SandhiStrip,
  'stroke-order': StrokeOrder,
  'character-parts': CharacterParts,
  'place-scene-zh': PlaceSceneZh,
  'measure-words': MeasureWords,
} satisfies Record<VisualId, ComponentType<never>>;
