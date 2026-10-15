'use client';

import { useMemo, useState } from 'react';
import type { Bilingual, HanziCard as HanziCardData, HokkienEntry, Lesson } from '@/lib/types';
import { tryAlign } from '@/lib/zh/align';
import { sandhi } from '@/lib/zh/sandhi';
import { markSyllable } from '@/lib/zh/pinyin';
import { syllableKey } from '@/lib/speech/audio';
import { Prose } from './Prose';
import { PlayButton } from './PlayButton';
import { ZhSentence } from '../zh/ZhSentence';
import { ZhText } from '../zh/ZhText';
import { Pinyin } from '../zh/Pinyin';
import { ToneContourMini } from '../visuals/ToneContourMini';
import { usePlay } from '../useSpeech';
import { useT } from '../ProgressProvider';
import { useZhText } from '../zh/ZhContext';

/**
 * Nada (DESIGN §6.6): a word with its tone contour, the sandhi applied if any, and two play buttons:
 * "ditulis" plays each syllable in its citation tone (recorded syllables), "diucapkan" the word as said.
 */
export function NadaCard({ tone }: { tone: NonNullable<Lesson['tone']> }) {
  const { t, lang } = useT();
  const play = usePlay();
  const { toneColours } = useZhText();
  const [playing, setPlaying] = useState<'written' | 'spoken' | null>(null);
  const s = useMemo(() => {
    const a = tryAlign(tone.zh, tone.py);
    return a ? sandhi(a).flatMap((w) => w.syllables) : [];
  }, [tone]);
  const aligned = useMemo(() => tryAlign(tone.zh, tone.py) ?? [], [tone]);
  const bases = aligned.flatMap((w) => w.chars.map((c) => c.syl.base));
  const written = s.map((x) => x.written);
  const spoken = s.map((x) => x.spoken);
  const changed = s.some((x) => x.rule);
  const writtenPy = bases.map((b, i) => markSyllable(b, written[i])).join(' ');
  const spokenPy = bases.map((b, i) => markSyllable(b, spoken[i])).join(' ');
  const keys = bases.map((b, i) => (written[i] ? syllableKey(b, written[i]) : null)).filter((k): k is string => !!k);

  const playWritten = async () => {
    setPlaying('written');
    for (const k of keys) await play(k);
    setPlaying(null);
  };
  const playSpoken = async () => {
    setPlaying('spoken');
    await play(tone.zh);
    setPlaying(null);
  };

  return (
    <section className="flex flex-col gap-4 rounded-lg bg-paper-2 p-5" aria-labelledby="nada-title">
      <h3 id="nada-title" className="label text-muted">
        {t('lesson.sound')}
      </h3>
      <div className="flex flex-wrap items-center gap-5">
        <ZhSentence zh={tone.zh} py={tone.py} size="sentence" play={false} showPinyin wordSheet={false} />
        <ToneContourMini tones={spoken} colours={toneColours} label={t('nada.contour', { tones: spoken.join(' ') })} />
      </div>
      <dl className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2">
        <dt className="label text-muted">{t('nada.written')}</dt>
        <dd>
          <Pinyin text={writtenPy} tones={toneColours} />
        </dd>
        <dd>{keys.length > 0 && <PlayButton text={keys[0]} onPlay={playWritten} playing={playing === 'written'} small label={t('nada.playWritten')} />}</dd>
        <dt className="label text-muted">{t('nada.spoken')}</dt>
        <dd>
          <Pinyin text={spokenPy} tones={toneColours} />
        </dd>
        <dd>
          <PlayButton text={tone.zh} onPlay={playSpoken} playing={playing === 'spoken'} small label={t('nada.playSpoken')} />
        </dd>
      </dl>
      {!changed && <p className="text-small text-muted">{t('nada.same')}</p>}
      <Prose text={lang === 'en' ? tone.note.en : tone.note.id} lang={lang} />
    </section>
  );
}

/**
 * Hanzi (DESIGN §6.6): each new character as a 72px tile on the practice grid with its stroke count,
 * radical chip and a one-line memory note. Stroke order plays inline where StrokeOrder is supplied.
 */
export function HanziCard({ chars, strokes }: { chars: HanziCardData[]; strokes?: (ch: string) => React.ReactNode }) {
  const { t, lang } = useT();
  const [open, setOpen] = useState<string | null>(null);
  if (!chars.length) return null;
  return (
    <section className="card flex flex-col gap-4 p-5" aria-labelledby="hanzi-title">
      <h3 id="hanzi-title" className="label text-muted">
        {t('lesson.hanzi')}
      </h3>
      <ul className="flex flex-col gap-4">
        {chars.map((c) => (
          <li key={c.ch} className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <ZhText className="tianzige flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-md bg-paper-2 text-[3rem] leading-none">
                {c.ch}
              </ZhText>
              <div className="flex min-w-0 flex-col gap-1">
                <Pinyin text={c.py} tones className="text-body" />
                <p className="flex flex-wrap items-center gap-2">
                  <span className="label tnum text-muted">{t('hanzi.strokes', { n: c.strokes })}</span>
                  <span className="label rounded-sm px-2 py-[2px] text-dasar" style={{ boxShadow: 'inset 0 0 0 1px var(--dasar)' }}>
                    {t('hanzi.radical')} <ZhText face="ui">{c.radical}</ZhText>
                  </span>
                </p>
                {strokes && (
                  <button type="button" className="btn btn-quiet min-h-touch self-start px-2" aria-expanded={open === c.ch} onClick={() => setOpen(open === c.ch ? null : c.ch)}>
                    ▶ {t('hanzi.playStrokes')}
                  </button>
                )}
              </div>
            </div>
            {c.note && (
              <div className="text-small">
                <Prose text={lang === 'en' ? c.note.en : c.note.id} lang={lang} />
              </div>
            )}
            {open === c.ch && strokes && <div className="fade-in">{strokes(c.ch)}</div>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Kata: Indonesian–Chinese word traps and bridges, with Hokkien loanwords the learner already knows. */
export function WordsCard({ words, hokkien = [] }: { words?: Bilingual; hokkien?: HokkienEntry[] }) {
  const { t, lang } = useT();
  if (!words && !hokkien.length) return null;
  return (
    <section className="flex flex-col gap-3 rounded-lg bg-accent-soft p-5" aria-labelledby="words-title">
      <h3 id="words-title" className="eyebrow">
        {t('lesson.words')}
      </h3>
      {words && <Prose text={lang === 'en' ? words.en : words.id} lang={lang} />}
      {hokkien.length > 0 && (
        <ul className="flex flex-col gap-2">
          {hokkien.map((h) => (
            <li key={h.id_word} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="label text-muted">Hokkien</span>
              <em lang="id">{h.id_word}</em>
              <span aria-hidden>→</span>
              <span className="label text-muted">Mandarin</span>
              <ZhText className="text-zh-small">{h.zh.replace(/\s+/g, '')}</ZhText>
              <Pinyin text={h.py} />
              <span className="text-small text-muted">· {lang === 'en' ? h.meaning.en : h.meaning.id}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Ngobrol: a 2–4 line exchange. */
export function TalkCard({ talk }: { talk: NonNullable<Lesson['talk']> }) {
  const { t, lang } = useT();
  return (
    <section className="flex flex-col gap-4 rounded-lg bg-paper-2 p-5" aria-labelledby="talk-title">
      <h3 id="talk-title" className="eyebrow">
        {t('lesson.talk')}
      </h3>
      <ol className="flex flex-col gap-4">
        {talk.lines.map((line, i) => (
          <li key={i} className="flex flex-col gap-1">
            <span className="label text-muted">{line.who}</span>
            <ZhSentence zh={line.zh} py={line.py} id={line.id} en={line.en} size="body" />
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
