import type { ComponentType } from 'react';
import type { VisualId } from '@/lib/visualIds';
import { LetterForms } from './LetterForms';
import { WordJoiner } from './WordJoiner';
import { HarakatBuilder } from './HarakatBuilder';
import { Makhraj } from './Makhraj';
import { SunMoon } from './SunMoon';
import { PlaceSceneAr } from './PlaceSceneAr';
import { Agreement } from './Agreement';

/** Visual id → component. Lesson frontmatter refers to visuals by id only. */
// Each visual takes VisualProps plus its own props from frontmatter.
export const registry = {
  'letter-forms': LetterForms,
  'word-joiner': WordJoiner,
  'harakat-builder': HarakatBuilder,
  makhraj: Makhraj,
  'sun-moon': SunMoon,
  'place-scene-ar': PlaceSceneAr,
  agreement: Agreement,
} satisfies Record<VisualId, ComponentType<never>>;
