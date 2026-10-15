'use client';

import { useMemo, useState } from 'react';
import { dayNumber, plan } from '@/lib/deck/schedule';
import { matchesWord } from '../WordsView';
import { DeckRunner } from './DeckRunner';
import type { DeckWord } from './DeckCard';
import { ZhText } from './ZhText';
import { Pinyin } from './Pinyin';
import { PlayButton } from '../lesson/PlayButton';
import { IconArrowRight, IconSearch } from '../ui/Icon';
import { usePlay } from '../useSpeech';
import { useHydrated, useProgress, useSettings, useT } from '../ProgressProvider';

export type Deck = { rung: string; name: string; hsk: string; words: DeckWord[] };

type Filter = 'all' | 'new' | 'learned' | 'lessons';

/**
 * Kartu kata (DESIGN §6.8): one card per rung (how many words are learned, today's new and due
 * counts, Mulai), and below it the full list with search and filters. No streak.
 */
export function DeckHome({ decks }: { decks: Deck[] }) {
  const { t } = useT();
  const progress = useProgress();
  const hydrated = useHydrated();
  const { deckDaily, toneColours } = useSettings();
  const play = usePlay();
  const [running, setRunning] = useState<{ deck: Deck; queue: DeckWord[] } | null>(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const today = dayNumber();

  const plans = useMemo(
    () => decks.map((d) => ({ d, p: plan(d.words, progress.deck, today, deckDaily, d.rung) })),
    [decks, progress.deck, today, deckDaily],
  );

  if (running) return <DeckRunner name={running.deck.name} queue={running.queue} onClose={() => setRunning(null)} />;
  if (!decks.length) return <p className="text-muted">{t('deck.none')}</p>;

  const studied = (id: string) => !!progress.deck[id] && (progress.deck[id].learned || progress.deck[id].lastSeen > 0);
  const chip = (on: boolean) =>
    `min-h-touch shrink-0 rounded-full px-4 text-small font-bold transition-colors duration-quick ${on ? 'bg-ink text-paper' : 'bg-surface text-ink shadow-e1 hover:bg-paper-2'}`;

  return (
    <div className="flex flex-col gap-6">
      {plans.map(({ d, p }) => {
        const learned = d.words.filter((w) => studied(w.id)).length;
        const queue = [...p.due, ...p.fresh];
        return (
          <section key={d.rung} className="card flex flex-col gap-3 p-5" aria-labelledby={`deck-${d.rung}`}>
            <h2 id={`deck-${d.rung}`} className="font-display text-card font-medium">
              {t('deck.title', { hsk: d.hsk })}
            </h2>
            <p className="text-small text-muted tnum">{t('deck.learned', { n: hydrated ? learned : 0, total: d.words.length })}</p>
            <span className="h-[4px] w-full overflow-hidden rounded-full bg-paper-2" aria-hidden>
              <span className="block h-full rounded-full bg-accent" style={{ width: `${(learned / d.words.length) * 100}%` }} />
            </span>
            <p className="text-small tnum">{t('deck.today', { n: hydrated ? p.fresh.length : 0, k: hydrated ? p.due.length : 0 })}</p>
            <button type="button" className="btn btn-primary self-start" disabled={!queue.length} onClick={() => setRunning({ deck: d, queue })}>
              {queue.length ? t('deck.start') : t('deck.nothing')} {queue.length > 0 && <IconArrowRight />}
            </button>
          </section>
        );
      })}

      <section className="flex flex-col gap-3" aria-labelledby="deck-list">
        <h2 id="deck-list" className="eyebrow">
          {t('deck.list')}
        </h2>
        <label className="flex min-h-[48px] items-center gap-2 rounded-lg bg-surface px-3 text-muted shadow-e1 focus-within:outline focus-within:outline-2 focus-within:outline-accent">
          <IconSearch />
          <span className="sr-only">{t('words.search')}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('words.searchPlaceholder')} className="min-h-touch min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t('deck.filter')}>
          {(['all', 'new', 'learned', 'lessons'] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} className={chip(filter === f)} onClick={() => setFilter(f)}>
              {t(`deck.filter.${f}`)}
            </button>
          ))}
        </div>
        {decks.map((d) => {
          const list = d.words.filter(
            (w) =>
              matchesWord({ zh: w.zh, py: w.py, id: w.mean }, q) &&
              (filter === 'all' || (filter === 'new' && !studied(w.id)) || (filter === 'learned' && studied(w.id)) || (filter === 'lessons' && !!w.lesson)),
          );
          return (
            <ul key={d.rung} className="card flex flex-col divide-y divide-rule overflow-hidden" aria-label={d.name}>
              {list.slice(0, 200).map((w) => (
                <li key={w.id} className="flex min-h-[56px] items-center gap-3 px-4 py-2">
                  <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3">
                    <ZhText face="ui" className="text-zh-small">
                      {w.zh}
                    </ZhText>
                    <Pinyin text={w.py} tones={toneColours !== false} className="text-small" />
                    <span lang={w.meanLang} className="id-text text-small">
                      {w.mean}
                    </span>
                  </span>
                  <span className={`label shrink-0 ${studied(w.id) ? 'text-good' : 'text-muted'}`}>{studied(w.id) ? t('deck.state.learned') : t('deck.state.new')}</span>
                  <PlayButton text={w.zh} onPlay={() => void play(w.zh)} small />
                </li>
              ))}
              {list.length > 200 && <li className="px-4 py-2 text-small text-muted">{t('deck.more', { n: list.length - 200 })}</li>}
              {list.length === 0 && <li className="px-4 py-3 text-small text-muted">{t('words.noMatch')}</li>}
            </ul>
          );
        })}
      </section>
    </div>
  );
}
