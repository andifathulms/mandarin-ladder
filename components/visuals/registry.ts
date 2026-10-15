import type { ComponentType } from 'react';
import type { VisualId } from '@/lib/visualIds';
import { StrokeOrder } from './StrokeOrder';
import { ToneContour } from './ToneContour';
import { SyllableBuilder } from './SyllableBuilder';
import { MouthPlaces } from './MouthPlaces';
import { SandhiStrip } from './SandhiStrip';
import { CharacterParts } from './CharacterParts';

/**
 * Visual id → component. Lesson frontmatter refers to visuals by id only. Partial until the Easy 1
 * visuals land; VisualStage renders nothing for a missing id.
 */
// Each visual takes VisualProps plus its own props from frontmatter.
export const registry: Partial<Record<VisualId, ComponentType<never>>> = {
  'tone-contour': ToneContour,
  'syllable-builder': SyllableBuilder,
  'mouth-places': MouthPlaces,
  'sandhi-strip': SandhiStrip,
  'stroke-order': StrokeOrder,
  'character-parts': CharacterParts,
};
