import type { ComponentType } from 'react';
import type { VisualId } from '@/lib/visualIds';

/**
 * Visual id → component. Lesson frontmatter refers to visuals by id only. Partial while the
 * Mandarin visuals are built (CLAUDE.md §10, M8–M9); VisualStage renders nothing for a missing id.
 */
// Each visual takes VisualProps plus its own props from frontmatter.
export const registry: Partial<Record<VisualId, ComponentType<never>>> = {};
