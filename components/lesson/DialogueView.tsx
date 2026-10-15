'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Dialogue, Rung } from '@/lib/types';
import * as store from '@/lib/progress/store';
import { rungHref } from '@/lib/routes';
import { useT } from '../ProgressProvider';
import { IconArrowLeft } from '../ui/Icon';
import { CheckItemView } from '../check/CheckItemView';
import { ArIsland } from '../ar/ArIsland';
import { ArSentence } from '../ar/ArSentence';
import { EgChip } from '../ar/EgChip';
import { Prose } from './Prose';

/** The Ngobrol capstone: an Egyptian dialogue with audio, transliteration and translation, then questions. */
export function DialogueView({ rung, dialogue }: { rung: Rung; dialogue: Dialogue }) {
  const { t, lang } = useT();
  const [solved, setSolved] = useState<string[]>([]);
  const allDone = solved.length === dialogue.items.length;
  useEffect(() => {
    if (allDone) store.completeCapstone(rung.id, 'dialogue');
  }, [allDone, rung.id]);
  const eg = dialogue.variety === 'eg';

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 border-b border-rule bg-surface">
        <div className="page flex max-w-lesson items-center gap-3 py-2">
          <Link
            href={rungHref(rung.id)}
            aria-label={t('nav.back')}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2"
          >
            <IconArrowLeft />
          </Link>
          <span className="label text-muted">
            {rung.name} · {t('talk.title')}
          </span>
          {eg && <EgChip />}
        </div>
      </header>

      <main className="page flex max-w-lesson flex-1 flex-col gap-6 py-7">
        <div className="flex flex-col gap-1">
          <p className="eyebrow">
            {t('talk.title')} · {t('lesson.mesir')}
          </p>
          <h1 className="text-h1" lang={lang}>
            {lang === 'en' ? dialogue.title.en : dialogue.title.id}
          </h1>
          <ArIsland block as="p" size="title" face="display" variety={dialogue.variety} className="text-muted">
            {dialogue.title.ar}
          </ArIsland>
        </div>

        <section className={`card flex flex-col gap-5 p-5 ${eg ? 'border-s-[3px] border-eg' : ''}`} aria-label={dialogue.title.id}>
          <ol className="flex flex-col gap-5">
            {dialogue.lines.map((line, i) => (
              <li key={i} className="flex flex-col gap-1">
                <span className="label text-muted">{line.who}</span>
                <ArSentence ar={line.ar} tr={line.tr} id={line.id} en={line.en} size="body" variety={dialogue.variety} chip={false} showTranslit />
              </li>
            ))}
          </ol>
          {dialogue.note && (
            <div className="text-small text-ink">
              <Prose text={lang === 'en' ? dialogue.note.en : dialogue.note.id} lang={lang} />
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6" aria-labelledby="talk-questions">
          <h2 id="talk-questions" className="text-h2">
            {t('read.questions')}
          </h2>
          {dialogue.items.map((item, i) => (
            <div key={item.id} className="flex flex-col gap-3 border-t border-rule pt-5">
              <p className="text-small font-bold tnum text-muted">{t('check.counter', { n: i + 1, total: dialogue.items.length })}</p>
              <CheckItemView
                mode="practice"
                item={item}
                numberKeys={false}
                onSolved={(firstTry) => {
                  store.recordAnswer(item.id, firstTry);
                  setSolved((s) => (s.includes(item.id) ? s : [...s, item.id]));
                }}
              />
            </div>
          ))}
        </section>

        <p aria-live="polite" className="font-bold text-good">
          {allDone ? t('talk.done') : ''}
        </p>
        <Link href={rungHref(rung.id)} className="btn btn-ghost self-start no-underline">
          {t('lesson.backToRung', { rung: rung.name })}
        </Link>
      </main>
    </div>
  );
}
