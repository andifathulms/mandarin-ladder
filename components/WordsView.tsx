'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { GlossaryEntry, LessonSummary, Rung } from '@/lib/types';
import { missedCount } from '@/lib/progress/derive';
import { lessonHref } from '@/lib/routes';
import { looseKey, hasArabic } from '@/lib/arabic/text';
import { translitKey } from '@/lib/arabic/translit';
import { useProgress, useT } from './ProgressProvider';
import { PageShell } from './ui/PageShell';
import { PlayButton } from './lesson/PlayButton';
import { IconBook, IconSearch } from './ui/Icon';
import { usePlay } from './useSpeech';
import { ArIsland } from './ar/ArIsland';
import { Translit } from './ar/Translit';
import { EgChip } from './ar/EgChip';

/** Search accepts Arabic with or without harakat, transliteration, or Indonesian (PRD §5.7). */
export function matchesWord(g: GlossaryEntry, q: string): boolean {
  const needle = q.trim();
  if (!needle) return true;
  if (hasArabic(needle)) {
    const k = looseKey(needle);
    return looseKey(g.ar).includes(k) || (!!g.eg && looseKey(g.eg).includes(k));
  }
  const n = translitKey(needle);
  const plain = (s: string) => translitKey(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  return (
    translitKey(g.tr).includes(n) ||
    plain(g.tr).includes(plain(needle)) ||
    g.id.toLowerCase().includes(needle.toLowerCase()) ||
    (g.en ?? '').toLowerCase().includes(needle.toLowerCase())
  );
}

type Props = { lessons: LessonSummary[]; rungs: Rung[]; rootsFrom?: string };

export function WordsView({ lessons, rungs, rootsFrom = 'easy-3' }: Props) {
  const { t, lang } = useT();
  const progress = useProgress();
  const play = usePlay();
  const [q, setQ] = useState('');
  const [only, setOnly] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(false);

  const rungIndex = (id: string) => rungs.findIndex((r) => r.id === id);
  const rungName = (id: string) => rungs.find((r) => r.id === id)?.name ?? id;
  // Roots are shown once Easy 3 has introduced them.
  const showRoots = Object.keys(progress.lessons).some((id) => {
    const l = lessons.find((x) => x.id === id);
    return l && rungIndex(l.rung) >= rungIndex(rootsFrom);
  });
  const opened = lessons
    .filter((l) => progress.opened.includes(l.id))
    .sort((a, b) => rungIndex(a.rung) - rungIndex(b.rung) || a.order - b.order);
  const total = opened.reduce((n, l) => n + l.glossary.length, 0);
  const groups = useMemo(
    () =>
      opened
        .filter((l) => (!only || l.id === only) && (!mistakes || missedCount(l, progress) > 0))
        .map((l) => ({ l, words: l.glossary.filter((g) => matchesWord(g, q)) }))
        .filter((g) => g.words.length),
    [opened, q, only, mistakes, progress],
  );

  const chip = (on: boolean) =>
    `min-h-touch shrink-0 rounded-full px-4 text-small font-bold transition-colors duration-quick ${
      on ? 'bg-ink text-paper' : 'bg-surface text-ink shadow-e1 hover:bg-paper-2'
    }`;

  return (
    <PageShell title={t('words.title')} subtitle={total > 0 ? t('words.subtitle', { n: total, l: opened.length }) : undefined}>
      {total === 0 ? (
        <div className="card flex flex-col items-start gap-3 p-5">
          <span className="flex h-[48px] w-[48px] items-center justify-center rounded-md bg-paper-2 text-muted">
            <IconBook size={24} />
          </span>
          <p className="max-w-measure text-muted">{t('words.empty')}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <label className="flex min-h-[48px] items-center gap-2 rounded-lg bg-surface px-3 text-muted shadow-e1 focus-within:outline focus-within:outline-2 focus-within:outline-accent">
              <IconSearch />
              <span className="sr-only">{t('words.search')}</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('words.searchPlaceholder')}
                dir="auto"
                className="min-h-touch min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted"
              />
            </label>
            <div className="relative -mx-gutter flex gap-2 overflow-x-auto px-gutter pb-1" role="group" aria-label={t('rung.lessons')}>
              <button type="button" aria-pressed={!only} className={chip(!only)} onClick={() => setOnly(null)}>
                {t('words.all')}
              </button>
              {opened.map((l) => (
                <button key={l.id} type="button" aria-pressed={only === l.id} className={chip(only === l.id)} onClick={() => setOnly(l.id)}>
                  {rungName(l.rung)} · <span className="tnum">{l.order}</span>
                </button>
              ))}
            </div>
            <label className="flex min-h-touch items-center gap-2 text-small">
              <input
                type="checkbox"
                checked={mistakes}
                onChange={(e) => setMistakes(e.target.checked)}
                className="h-[20px] w-[20px]"
                style={{ accentColor: 'var(--accent)' }}
              />
              {t('words.mistakesOnly')}
            </label>
          </div>
          {groups.length === 0 ? (
            <p className="text-muted">{t('words.noMatch')}</p>
          ) : (
            groups.map(({ l, words }) => (
              <section key={l.id} className="flex flex-col gap-2">
                <h2 className="eyebrow">
                  <Link href={lessonHref(l)} className="text-muted no-underline hover:text-accent">
                    {t('words.group', { rung: rungName(l.rung), n: l.order })} · {lang === 'en' ? l.title.en : l.title.id}
                  </Link>
                </h2>
                <ul className="card flex flex-col divide-y divide-rule overflow-hidden">
                  {words.map((w) => (
                    <li key={w.ar} className="flex min-h-[64px] items-center gap-3 px-4 py-2">
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="flex flex-wrap items-baseline gap-x-3">
                          {/* Always fully vowelled here, whatever the rung's harakat level. */}
                          <ArIsland size="small">{w.ar}</ArIsland>
                          <Translit text={w.tr} />
                          <span lang={lang === 'en' && w.en ? 'en' : 'id'} className="id-text text-small">
                            {lang === 'en' ? (w.en ?? w.id) : w.id}
                          </span>
                        </span>
                        {w.eg && (
                          <span className="flex flex-wrap items-center gap-2">
                            <EgChip />
                            <ArIsland size="small" variety="eg">
                              {w.eg}
                            </ArIsland>
                            {w.eg_tr && <Translit text={w.eg_tr} />}
                          </span>
                        )}
                        {showRoots && w.root && (
                          <span className="label text-muted">
                            {t('words.root')} <ArIsland face="ui">{w.root}</ArIsland>
                          </span>
                        )}
                      </span>
                      {w.gender && (
                        <span className="label rounded-sm bg-accent-soft px-2 py-[2px] text-accent" title={t(w.gender === 'm' ? 'words.genderM' : 'words.genderF')}>
                          {w.gender}
                        </span>
                      )}
                      <PlayButton text={w.ar} onPlay={() => void play(w.ar)} small />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </>
      )}
    </PageShell>
  );
}
