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
import { hasHan } from '@/lib/zh/text';
import { ZhSentence } from '../zh/ZhSentence';
import { ZhText } from '../zh/ZhText';
import { ZhTextOverride } from '../zh/ZhContext';
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
 * The quoted resume line. Chinese is set in WenKai at --t-zh-body with ruby pinyin in --board-muted
 * when the rung shows pinyin (DESIGN §6.2); Latin lines keep the display serif. A ___ is a brass line.
 */
function BoardSentence({ quote, showPinyin }: { quote: Quote; showPinyin: boolean }) {
  const parts = quote.text.split('___');
  const withBlanks = (w: string) =>
    parts.map((p, i) => (
      <span key={i}>
        {p}
        {i < parts.length - 1 && <Blank width={w} />}
      </span>
    ));
  if (quote.zh && quote.py) {
    return (
      <div className="on-board">
        <ZhTextOverride showPinyin={showPinyin} toneColours={false}>
          <ZhSentence zh={quote.zh} py={quote.py} size="body" play={false} wordSheet={false} />
        </ZhTextOverride>
      </div>
    );
  }
  if (hasHan(quote.text)) {
    return (
      <ZhText as="p" className="text-zh-body text-board-ink">
        {withBlanks('w-[2em]')}
      </ZhText>
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
    return <TwoDoorWelcome dasarHref={firstLessonHref} placementHref={placementHref} />;
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
      <BoardSentence quote={text} showPinyin={rung?.pinyin === 'always'} />
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
