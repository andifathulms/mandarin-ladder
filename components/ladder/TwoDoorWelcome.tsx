'use client';

import Link from 'next/link';
import { Lattice } from '../ui/Lattice';
import { IconArrowRight } from '../ui/Icon';
import { ArIsland } from '../ar/ArIsland';
import { useT } from '../ProgressProvider';
import { Accented } from './ContinueCard';

type Props = { hurufHref: string | null; placementHref: string | null };

function Door({ href, title, sub, primary }: { href: string; title: string; sub: string; primary: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-h-[64px] w-full items-center justify-between gap-3 rounded-lg px-5 py-3 no-underline transition-transform duration-quick active:scale-[0.99] ${
        primary ? 'bg-board-ink text-board' : 'text-board-ink shadow-[inset_0_0_0_1.5px_var(--board-muted)] hover:bg-board-2'
      }`}
    >
      <span className="flex flex-col">
        <span className="font-body font-bold">{title}</span>
        <span className={`text-small ${primary ? 'text-board-2' : 'text-board-muted'}`}>{sub}</span>
      </span>
      <IconArrowRight className="shrink-0" />
    </Link>
  );
}

/** First visit: two doors instead of one button (PRD §5.1, DESIGN §6.2). */
export function TwoDoorWelcome({ hurufHref, placementHref }: Props) {
  const { t } = useT();
  return (
    <section className="board flex flex-col gap-4 p-6 min-[900px]:gap-5 min-[900px]:p-9" aria-labelledby="welcome-title">
      <Lattice />
      <div className="flex items-start justify-between gap-3">
        <p className="label text-brass">{t('home.startHere')}</p>
        <ArIsland face="display" className="text-ar-title leading-none text-board-ink" aria-hidden>
          سُلَّم
        </ArIsland>
      </div>
      <h2 id="welcome-title" className="max-w-[16ch] text-h1 leading-[1.1] tracking-[-0.02em] text-board-ink">
        <Accented text={t('home.welcomeTitle')} />
      </h2>
      <p className="max-w-measure text-board-muted">{t('home.doorsBody')}</p>
      <div className="flex flex-col gap-3">
        {hurufHref && <Door href={hurufHref} title={t('home.door1')} sub={t('home.door1Sub')} primary />}
        {placementHref && <Door href={placementHref} title={t('home.door2')} sub={t('home.door2Sub')} primary={false} />}
      </div>
    </section>
  );
}
