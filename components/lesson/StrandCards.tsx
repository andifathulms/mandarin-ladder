'use client';

import { useState } from 'react';
import type { Bilingual, Lesson } from '@/lib/types';
import { Prose } from './Prose';
import { PlayButton } from './PlayButton';
import { ArIsland } from '../ar/ArIsland';
import { ArSentence } from '../ar/ArSentence';
import { EgChip } from '../ar/EgChip';
import { Translit } from '../ar/Translit';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';

/** Bunyi: one pronunciation point, the focus sound as big glyphs, words to play, and a tip. */
export function SoundCard({ sound, thumb }: { sound: NonNullable<Lesson['sound']>; thumb?: React.ReactNode }) {
  const { t, lang } = useT();
  const play = usePlay();
  const [playing, setPlaying] = useState<string | null>(null);
  const run = async (s: string) => {
    setPlaying(s);
    await play(s);
    setPlaying(null);
  };
  const glyphs = [sound.focus, sound.compare].filter(Boolean) as string[];
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-paper-2 p-5" aria-labelledby="sound-title">
      <h3 id="sound-title" className="eyebrow">
        {t('lesson.sound')}
      </h3>
      <div className="flex flex-wrap items-center gap-5">
        <div className="flex items-center gap-3">
          {glyphs.map((g, i) => (
            <span key={g} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden className="pe-2 text-h2 text-muted">
                  ·
                </span>
              )}
              <ArIsland size="glyph" face="display" className="leading-none">
                {g}
              </ArIsland>
              <PlayButton text={g} onPlay={() => run(g)} playing={playing === g} small />
            </span>
          ))}
        </div>
        {thumb}
      </div>
      <ul className="flex flex-wrap gap-2">
        {sound.words.map((w) => (
          <li key={w.ar} className="card flex items-center gap-2 py-1 pe-1 ps-3">
            <span className="flex flex-col">
              <ArIsland size="small">{w.ar}</ArIsland>
              <Translit text={w.tr} />
            </span>
            <PlayButton text={w.ar} onPlay={() => run(w.ar)} playing={playing === w.ar} small />
          </li>
        ))}
      </ul>
      <Prose text={lang === 'en' ? sound.tip.en : sound.tip.id} lang={lang} />
    </section>
  );
}

/** Mesir: how Egyptians say the examples, Fusha and Egyptian side by side. */
export function MesirCard({ examples, note }: { examples: Lesson['examples']; note?: Bilingual }) {
  const { t, lang } = useT();
  const pairs = examples.filter((e) => e.eg && e.eg_tr);
  if (!pairs.length) return null;
  return (
    <section className="card flex flex-col gap-4 border-s-[3px] border-eg p-5" aria-labelledby="mesir-title">
      <h3 id="mesir-title" className="label flex items-center gap-2 text-eg">
        <span aria-hidden>●</span> {t('lesson.mesir')}
      </h3>
      <ul className="flex flex-col gap-5">
        {pairs.map((e) => (
          <li key={e.ar} className="grid gap-3 min-[640px]:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="label text-muted">{t('lesson.fusha')}</span>
              <ArSentence ar={e.ar} tr={e.tr} size="body" showTranslit />
            </div>
            <div className="flex flex-col gap-1">
              <span className="label text-eg">{t('lesson.mesirRow')}</span>
              <ArSentence ar={e.eg!} tr={e.eg_tr} size="body" variety="eg" chip={false} showTranslit />
            </div>
          </li>
        ))}
      </ul>
      {note && (
        <div className="text-small text-ink">
          <Prose text={lang === 'en' ? note.en : note.id} lang={lang} />
        </div>
      )}
    </section>
  );
}

/** Kata: loanword meaning shifts between Indonesian and Arabic. */
export function WordsCard({ words }: { words: Bilingual }) {
  const { t, lang } = useT();
  return (
    <section className="flex flex-col gap-2 rounded-lg bg-accent-soft p-5" aria-labelledby="words-title">
      <h3 id="words-title" className="eyebrow">
        {t('lesson.words')}
      </h3>
      <Prose text={lang === 'en' ? words.en : words.id} lang={lang} />
    </section>
  );
}

/** Ngobrol: a short exchange in Fusha or Egyptian, marked as which. */
export function TalkCard({ talk }: { talk: NonNullable<Lesson['talk']> }) {
  const { t, lang } = useT();
  const eg = talk.variety === 'eg';
  return (
    <section
      className={`flex flex-col gap-4 rounded-lg bg-paper-2 p-5 ${eg ? 'border-s-[3px] border-eg' : ''}`}
      aria-labelledby="talk-title"
    >
      <h3 id="talk-title" className="eyebrow flex items-center gap-2">
        {t('lesson.talk')} {eg ? <EgChip /> : <span className="text-muted">· {t('lesson.fusha')}</span>}
      </h3>
      <ol className="flex flex-col gap-4">
        {talk.lines.map((line, i) => (
          <li key={i} className="flex flex-col gap-1">
            <span className="label text-muted">{line.who}</span>
            <ArSentence ar={line.ar} tr={line.tr} id={line.id} en={line.en} size="body" variety={talk.variety} chip={false} />
            {line.note && (
              <div className="self-start rounded-sm bg-accent-soft px-3 py-1 text-small text-ink" role="note">
                <Prose text={lang === 'en' ? line.note.en : line.note.id} lang={lang} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
