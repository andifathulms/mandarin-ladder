'use client';

import { useEffect, useState } from 'react';
import { withBase } from '@/lib/basePath';
import type { StrokeData } from '@/lib/zh/trace';

const cache = new Map<string, Promise<StrokeData | null>>();

/** public/strokes/<codepoint>.json, fetched once per character (the service worker keeps it offline). */
export function loadStrokes(ch: string): Promise<StrokeData | null> {
  if (!cache.has(ch)) {
    const file = `${ch.codePointAt(0)!.toString(16)}.json`;
    cache.set(
      ch,
      typeof fetch === 'undefined'
        ? Promise.resolve(null)
        : fetch(withBase(`/strokes/${file}`))
            .then((r) => (r.ok ? (r.json() as Promise<StrokeData>) : null))
            .catch(() => null),
    );
  }
  return cache.get(ch)!;
}

/** Test helper: seed stroke data without a network. */
export function __setStrokes(ch: string, data: StrokeData | null) {
  cache.set(ch, Promise.resolve(data));
}

/** Stroke data for a character: undefined while loading, null when there is none. */
export function useStrokes(ch: string): StrokeData | null | undefined {
  const [data, setData] = useState<StrokeData | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    setData(undefined);
    void loadStrokes(ch).then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, [ch]);
  return data;
}
