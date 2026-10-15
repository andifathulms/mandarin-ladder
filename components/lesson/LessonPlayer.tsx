'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Lesson, LessonSummary, Rung } from '@/lib/types';
import * as store from '@/lib/progress/store';
import { sfx } from '@/lib/speech/sfx';
import { lessonHref, rungHref, testHref } from '@/lib/routes';
import { useProgress, useT } from '../ProgressProvider';
import { IconArrowLeft, IconArrowRight, IconCheck, IconClose } from '../ui/Icon';
import { Badge } from '../ui/Badge';
import { NotchBar } from '../ladder/NotchBar';
import { BottomActionBar } from './BottomActionBar';
import { PairCard } from './PairCard';
import { Prose } from './Prose';
import { StepBar } from './StepBar';
import { StepLabel } from './StepLabel';
import { SoundCard, TalkCard, WordsCard } from './StrandCards';
import { TirukanCard } from './TirukanCard';
import { GlossaryChips } from './GlossaryChips';
import { LessonTopToggles } from './LessonTopToggles';
import { ArIsland } from '../ar/ArIsland';
import { ArSentence } from '../ar/ArSentence';
import { LessonTextProvider } from '../ar/LessonText';
import { CheckStep } from '../check/CheckStep';
import { VisualStage } from '../visuals/VisualStage';
import { STEP_KEYS } from './steps';

type Props = {
  lesson: Lesson;
  rung: Rung;
  rungLessons: LessonSummary[];
  next: LessonSummary | null;
  hasTest: boolean;
  spiralRung: string | null;
};

export function LessonPlayer({ lesson, rung, rungLessons, next, hasTest, spiralRung }: Props) {
  const { t, lang } = useT();
  const progress = useProgress();
  // Lesson-scoped supports (CLAUDE.md §7.2): plain state, so they reset when the lesson closes.
  const [pinyinOn, setPinyinOn] = useState(false);
  const [toneOn, setToneOn] = useState<boolean | null>(null);
  const [holdHint, setHoldHint] = useState(rung.pinyin === 'on-request');
  const showTranslit = rung.pinyin === 'always' || pinyinOn;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [ready, setReady] = useState(false);
  const [checkIndex, setCheckIndex] = useState(0);
  const [solved, setSolved] = useState<boolean[]>(() => lesson.check.map(() => false));
  const [freshNotch, setFreshNotch] = useState<number | undefined>(undefined);
  const headingRef = useRef<HTMLDivElement>(null);
  // The hold hint shows once per lesson, on the first Examples visit.
  useEffect(() => {
    if (step > 2) setHoldHint(false);
  }, [step]);
  const announceRef = useRef<HTMLParagraphElement>(null);

  // Resume where the learner stopped. Runs once, after stored progress is readable.
  useEffect(() => {
    const lp = store.getState().lessons[lesson.id];
    if (lp && !lp.completed) {
      setStep(lp.step);
      if (lp.checkIndex !== undefined) {
        const k = Math.min(lp.checkIndex, lesson.check.length - 1);
        setCheckIndex(k);
        setSolved(lesson.check.map((_, i) => i < k));
      }
    } else if (lp?.completed) {
      store.restartLesson(lesson.id);
    } else {
      store.setLessonStep(lesson.id, 0);
    }
    setReady(true);
  }, [lesson.id, lesson.check]);

  // Save position silently on every step / check change.
  useEffect(() => {
    if (!ready || step === 5) return;
    store.setLessonStep(lesson.id, step, step === 4 ? checkIndex : undefined);
  }, [ready, step, checkIndex, lesson.id]);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to > 5) return;
      setDir(to > step ? 'fwd' : 'back');
      setStep(to);
      if (to === 5) {
        const wasDone = store.getState().lessons[lesson.id]?.completed;
        store.completeLesson(lesson.id);
        if (!wasDone) setFreshNotch(lesson.order - 1);
        sfx('lessonDone');
      }
      window.scrollTo({ top: 0 });
    },
    [step, lesson.id, lesson.order],
  );

  // Announce and move focus to the new step.
  useEffect(() => {
    if (!ready) return;
    const name = t(STEP_KEYS[step]);
    if (announceRef.current) announceRef.current.textContent = t('lesson.stepAnnounce', { n: step + 1, name });
    headingRef.current?.querySelector<HTMLElement>('h2[tabindex]')?.focus({ preventScroll: true });
  }, [step, ready, t]);

  const checksDone = solved.every(Boolean);
  const canContinue = step !== 4 || solved[checkIndex];
  const advance = useCallback(() => {
    if (step === 4 && checkIndex < lesson.check.length - 1) {
      setCheckIndex(checkIndex + 1);
      return;
    }
    go(step + 1);
  }, [step, checkIndex, lesson.check.length, go]);

  // Keyboard: ←/→ between steps, Enter to continue, Space to play the first sentence.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const el = document.activeElement as HTMLElement | null;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (typing) return;
      const onControl = el && el !== document.body && el.matches('button, a, [role="radio"], summary');
      if (e.key === 'ArrowRight' && !el?.closest('[data-visual]')) {
        if (canContinue && step < 5) {
          e.preventDefault();
          advance();
        }
      } else if (e.key === 'ArrowLeft' && !el?.closest('[data-visual]')) {
        if (step > 0) {
          e.preventDefault();
          go(step - 1);
        }
      } else if (e.key === 'Enter' && !onControl) {
        if (canContinue && step < 5) {
          e.preventDefault();
          advance();
        }
      } else if (e.key === ' ' && !onControl) {
        const btn = document.querySelector<HTMLButtonElement>('main [data-play]');
        if (btn) {
          e.preventDefault();
          btn.click();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, canContinue, go, advance]);

  // Explanations are always Indonesian, with English as a UI-language option (PRD §5.3).
  const explain = (b: { id: string; en: string }) => <Prose text={lang === 'en' ? b.en : b.id} lang={lang} />;
  const titleMain = lang === 'en' ? lesson.title.en : lesson.title.id;

  const missed = lesson.check.filter((c) => progress.items[c.id]?.firstTry === false).length;
  const done = rungLessons.filter((l) => progress.lessons[l.id]?.completed).length;
  const climbed = !!progress.rungs[rung.id]?.climbed;

  let body: React.ReactNode;
  switch (step) {
    case 0:
      body = (
        <>
          <StepLabel>{t('step.concept')}</StepLabel>
          <div className="flex flex-col gap-1">
            <h1 className="text-h1" lang={lang}>
              {titleMain}
            </h1>
            {lang === 'en' && (
              <p className="id-text" lang="id">
                {lesson.title.id}
              </p>
            )}
            <ArIsland block as="p" size="title" face="display" className="text-muted">
              {lesson.title.ar}
            </ArIsland>
          </div>
          {explain(lesson.concept)}
        </>
      );
      break;
    case 1:
      body = (
        <>
          <StepLabel>{t('step.see')}</StepLabel>
          {lesson.visual ? (
            <VisualStage visual={lesson.visual} />
          ) : (
            <section className="flex flex-col gap-4 rounded-lg bg-paper-2 p-5">
              <h3 className="eyebrow">{t('lesson.worked')}</h3>
              <ul className="flex flex-col gap-4">
                {lesson.worked!.map((w) => (
                  <li key={w.ar}>
                    <ArSentence ar={w.ar} tr={w.tr} id={w.id} en={w.en} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      );
      break;
    case 2:
      body = (
        <>
          <StepLabel>{t('step.examples')}</StepLabel>
          <p className="text-small text-muted">{t('lesson.tapFocus')}</p>
          {holdHint && (
            <p className="self-start rounded-sm bg-paper-2 px-3 py-1 text-small text-muted" role="note">
              {t('lesson.holdHint')}
            </p>
          )}
          <ul className="flex flex-col gap-6">
            {lesson.examples.map((ex) => (
              <li key={ex.ar}>
                <ArSentence ar={ex.ar} tr={ex.tr} id={ex.id} en={ex.en} note={ex.display_only ? undefined : (ex.note ?? true)} />
              </li>
            ))}
          </ul>
          {lesson.sound && (
            <SoundCard sound={lesson.sound} />
          )}
          {lesson.talk && <TalkCard talk={lesson.talk} />}
          <TirukanCard {...lesson.tirukan} />
        </>
      );
      break;
    case 3:
      body = (
        <>
          <StepLabel>{t('step.contrast')}</StepLabel>
          {explain(lesson.contrast)}
          <PairCard off={lesson.pair.off} natural={lesson.pair.natural} />
          {lesson.words && <WordsCard words={lesson.words} />}
        </>
      );
      break;
    case 4:
      body = (
        <>
          <StepLabel>{t('step.check')}</StepLabel>
          <CheckStep
            items={lesson.check}
            index={checkIndex}
            solved={solved}
            onSolved={(i) => setSolved((s) => s.map((v, j) => (j === i ? true : v)))}
          />
        </>
      );
      break;
    default:
      body = (
        <>
          <div className="flex flex-col items-center gap-3 pt-2 text-center">
            <span
              className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-accent text-accent-ink"
              style={{ boxShadow: '0 0 0 10px var(--accent-soft)' }}
            >
              <IconCheck size={36} draw />
            </span>
            <StepLabel>{t('step.done')}</StepLabel>
            <h1 className="text-h1 tracking-[-0.015em]">
              {t('lesson.doneTitle', { title: titleMain })}
            </h1>
            <p className="max-w-measure text-muted">{lang === 'en' ? lesson.summary.en : lesson.summary.id}</p>
          </div>
          <div className="card flex flex-col gap-3 p-4">
            <p className="flex items-baseline justify-between gap-3">
              <span className="font-display font-semibold">{rung.name}</span>
              <span className="label tnum text-muted">
                {climbed ? rung.lessons : done} / {rung.lessons}
              </span>
            </p>
            <NotchBar total={rung.lessons} done={done} climbed={climbed} fresh={freshNotch} size="lg" />
          </div>
          <section className="flex flex-col gap-2">
            <h3 className="eyebrow">{t('lesson.newWords')}</h3>
            <GlossaryChips words={lesson.glossary} />
          </section>
          <p className="text-muted">{missed ? t('lesson.toReview', { n: missed }) : checksDone ? t('lesson.allFirstTry') : null}</p>
          {spiralRung && <p className="text-small text-muted">{t('lesson.spiral', { rung: spiralRung })}</p>}
        </>
      );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 border-b border-rule bg-surface">
        <div className="page flex max-w-lesson items-center gap-2 py-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              aria-label={t('lesson.prev')}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2"
            >
              <IconArrowLeft />
            </button>
          ) : (
            <Link
              href={rungHref(rung.id)}
              aria-label={t('nav.back')}
              className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2"
            >
              <IconArrowLeft />
            </Link>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <StepBar step={step} />
            <div className="flex items-center justify-between gap-2">
              <span className="label flex min-w-0 items-center gap-2 tnum text-muted">
                <span className="truncate">
                  {rung.name} · {lesson.order}
                </span>
                {lesson.status === 'draft' && (
                  <span className="hidden sm:inline-flex">
                    <Badge>{t('lesson.draft')}</Badge>
                  </span>
                )}
              </span>
              <span className="label shrink-0 tnum text-accent" aria-hidden>
                {step + 1} / 6
              </span>
            </div>
          </div>
          <LessonTopToggles
            pinyin={rung.pinyin}
            pinyinOn={pinyinOn}
            toneOn={toneOn ?? rung.tone_colours_default}
            onPinyin={setPinyinOn}
            onTone={setToneOn}
          />
          <Link
            href={rungHref(rung.id)}
            aria-label={t('lesson.close')}
            className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-ink hover:bg-paper-2"
          >
            <IconClose />
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-paper py-5 sm:py-7">
        <p ref={announceRef} className="sr-only" aria-live="polite" />
        <div className="page max-w-lesson sm:rounded-lg sm:bg-surface sm:px-7 sm:py-7 sm:shadow-e2">
          <LessonTextProvider harakat="full" showTranslit={showTranslit}>
            <div
              key={step}
              ref={headingRef}
              className={`flex flex-col gap-5 ${ready ? (dir === 'fwd' ? 'step-fwd' : 'step-back') : ''}`}
            >
              {body}
            </div>
          </LessonTextProvider>
        </div>
      </main>

      <BottomActionBar feedback={step === 4 && solved[checkIndex] ? lesson.check[checkIndex].why : null}>
        {step < 5 ? (
          <button
            type="button"
            className={`btn w-full max-w-[360px] ${step === 4 && solved[checkIndex] ? 'btn-good' : 'btn-primary'}`}
            disabled={!canContinue}
            onClick={advance}
          >
            {t('lesson.next')} <IconArrowRight />
          </button>
        ) : (
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            {next ? (
              <button type="button" className="btn btn-primary" onClick={() => router.push(lessonHref(next))}>
                {t('lesson.nextLesson', { n: next.order })} <IconArrowRight />
              </button>
            ) : hasTest ? (
              <Link href={testHref(rung.id)} className="btn btn-primary no-underline">
                {t('lesson.takeTest', { rung: rung.name })} <IconArrowRight />
              </Link>
            ) : null}
            <Link href={rungHref(rung.id)} className="btn btn-ghost no-underline">
              {t('lesson.backToRung', { rung: rung.name })}
            </Link>
          </div>
        )}
      </BottomActionBar>
    </div>
  );
}
