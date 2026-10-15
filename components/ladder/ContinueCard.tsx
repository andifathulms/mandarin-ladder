'use client';

import Link from 'next/link';
import type { ContinueTarget } from '@/lib/progress/derive';
import type { Rung } from '@/lib/types';
import { lessonHref, testHref } from '@/lib/routes';
import { IconArrowRight } from '../ui/Icon';
import { useT } from '../ProgressProvider';
import { STEP_KEYS } from '../lesson/steps';
import { Lattice } from '../ui/Lattice';
import type { Quote } from '@/lib/types';
import { hasArabic } from '@/lib/arabic/text';
import { ArIsland } from '../ar/ArIsland';
import { Translit } from '../ar/Translit';
import { TwoDoorWelcome } from './TwoDoorWelcome';

/** Sets the last word in brass italic, the way the board marks what matters. */
export function Accented({ text, tone = 'text-brass' }: { text: string; tone?: string }) {
  const i = text.trimEnd().lastIndexOf(' ');
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i + 1)}
      <em className={`font-display italic ${tone}`}>{text.slice(i + 1)}</em>
    </>
  );
}

/** A ___ blank on the board: a brass underline, announced as "blank". */
function Blank({ width }: { width: string }) {
  return (
    <>
      <span aria-hidden className={`mx-[2px] inline-block h-[0.9em] ${width} border-b-[3px] border-brass align-[-0.1em]`} />
      <span className="sr-only">blank</span>
    </>
  );
}

/**
 * The quoted resume line. Arabic is set in Naskh at --t-ar-body in an RTL island, with the
 * transliteration beneath when the rung shows it; Latin lines keep the display serif.
 */
function BoardSentence({ quote, showTr }: { quote: Quote; showTr: boolean }) {
  const parts = quote.text.split('___');
  const withBlanks = (w: string) =>
    parts.map((p, i) => (
      <span key={i}>
        {p}
        {i < parts.length - 1 && <Blank width={w} />}
      </span>
    ));
  if (hasArabic(quote.text)) {
    return (
      <div className="flex flex-col gap-1">
        <ArIsland block as="p" size="body" className="text-board-ink">
          {withBlanks('w-[3em]')}
        </ArIsland>
        {showTr && quote.tr && <Translit text={quote.tr} onBoard />}
      </div>
    );
  }
  return (
    <p className="font-display text-h1 font-medium leading-tight tracking-[-0.01em] text-board-ink" lang="id">
      {withBlanks('w-[2.4em]')}
    </p>
  );
}

function StepDots({ step }: { step: number }) {
  return (
    <span aria-hidden className="flex min-w-[120px] flex-1 gap-[4px]">
      {STEP_KEYS.map((k, i) => (
        <span key={k} className={`h-[4px] flex-1 rounded-full ${i <= step ? 'bg-brass' : 'bg-board-2'}`} />
      ))}
    </span>
  );
}

/** The board: the single next thing to do, quoting the exact sentence where you stopped. */
type CardProps = { target: ContinueTarget; firstLessonHref: string | null; placementHref: string | null; rungs: Rung[] };

export function ContinueCard({ target, firstLessonHref, placementHref, rungs }: CardProps) {
  const { t, lang } = useT();
  const shell = 'board flex flex-col gap-4 p-6 min-[900px]:gap-5 min-[900px]:p-9';

  if (target.kind === 'welcome') {
    return <TwoDoorWelcome hurufHref={firstLessonHref} placementHref={placementHref} />;
  }

  if (target.kind === 'test') {
    return (
      <section className={shell} aria-labelledby="continue-title">
        <Lattice />
        <p id="continue-title" className="label text-brass">
          {t('home.continue')} · {target.rung.name}
        </p>
        <p className="font-display text-h1 font-medium text-board-ink">
          <Accented text={t('test.title', { rung: target.rung.name })} />
        </p>
        <p className="text-board-muted">{t('home.testReady')}</p>
        <div>
          <Link href={testHref(target.rung.id)} className="btn btn-board no-underline">
            {t('home.continueBtn')} <IconArrowRight />
          </Link>
        </div>
      </section>
    );
  }

  const { lesson, step, text } = target;
  const rung = rungs.find((r) => r.id === lesson.rung);
  return (
    <section className={shell} aria-labelledby="continue-title">
      <Lattice />
      <p id="continue-title" className="label tnum text-brass">
        {t('home.continue')} · {rung?.name} · {t('home.lessonN', { n: lesson.order })}
        <span aria-hidden> · {t(STEP_KEYS[step])}</span>
        {step > 0 && <span className="sr-only"> · {t('home.step', { n: step + 1 })}</span>}
      </p>
      <BoardSentence quote={text} showTr={rung?.translit === 'always'} />
      <p className={`text-small text-board-muted ${lang === 'en' ? '' : 'italic'}`} lang={lang}>
        {lang === 'en' ? lesson.title.en : lesson.title.id}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <StepDots step={step} />
        <Link href={lessonHref(lesson)} className="btn btn-board no-underline">
          {t('home.continueBtn')} <IconArrowRight />
        </Link>
      </div>
    </section>
  );
}
