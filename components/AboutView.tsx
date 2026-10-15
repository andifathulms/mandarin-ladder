'use client';

import { useT } from './ProgressProvider';
import { PageShell } from './ui/PageShell';

const REPO = 'https://github.com/andifathulms/arabic-ladder';

const copy = {
  id: [
    {
      h: 'Apa ini',
      p: 'Arabic Ladder adalah kursus bahasa Arab bertingkat untuk penutur bahasa Indonesia, mulai dari nol: belum kenal huruf, belum kenal bunyi, belum kenal kata. Ada sebelas anak tangga, dari huruf pertama sampai membaca teks Arab tanpa harakat. Fusha menjadi tulang punggungnya, dan bahasa Mesir menjadi untaian percakapannya.',
    },
    {
      h: 'Tentang CEFR',
      p: 'CEFR adalah skala internasional untuk kemampuan bahasa, dari A1 sampai C2. Label CEFR di sini hanya panduan: penyelarasan CEFR untuk bahasa Arab belum semapan bahasa-bahasa Eropa. Untuk kebanyakan orang dewasa Indonesia, mencapai B2 butuh dua sampai tiga tahun belajar dengan tekun.',
    },
    {
      h: 'Progresmu',
      p: 'Tidak ada akun dan tidak ada pelacakan. Progresmu hanya tersimpan di browser ini. Kamu bisa mengekspor dan mengimpornya di Pengaturan.',
    },
    {
      h: 'Cara pelajaran ditulis',
      p: 'Pelajaran disusun dengan bantuan AI, lalu diperiksa oleh guru bahasa Arab atau penutur asli sebelum ditandai siap. Baris bahasa Mesir diperiksa oleh penutur Mesir. Pelajaran yang belum diperiksa diberi tanda Draft.',
    },
    {
      h: 'Siapa yang membuat',
      p: 'Dibuat oleh Fathul, saudara dari English Ladder, untuk orang yang ingin naik pelan-pelan tanpa merasa dihakimi.',
    },
  ],
  en: [
    {
      h: 'What this is',
      p: 'Arabic Ladder is a levelled Arabic course for Indonesian speakers, starting from complete zero: no script, no sounds, no words. Eleven rungs take you from the first letter to reading Arabic without vowel marks. Fusha (Modern Standard Arabic) is the backbone, and Egyptian Arabic is the spoken strand.',
    },
    {
      h: 'About CEFR',
      p: 'CEFR is an international scale for language ability, from A1 to C2. The CEFR labels here are a guide only: CEFR alignment for Arabic is less established than for European languages. For most Indonesian adults, reaching B2 takes two to three years of steady study.',
    },
    {
      h: 'Your progress',
      p: 'There are no accounts and no tracking. Your progress lives only in this browser. You can export and import it in Settings.',
    },
    {
      h: 'How lessons are written',
      p: 'Lessons are drafted with AI help, then checked by an Arabic teacher or native speaker before they are marked ready. Egyptian lines are checked by an Egyptian speaker. Lessons not yet checked carry a Draft badge.',
    },
    {
      h: 'Who made it',
      p: 'Made by Fathul, as a sibling of English Ladder, for people who want to climb slowly without feeling judged.',
    },
  ],
};

export function AboutView() {
  const { t, lang } = useT();
  return (
    <PageShell title={t('about.title')} back={{ href: '/me/', label: t('nav.me') }}>
      {copy[lang].map((s) => (
        <section key={s.h} className="flex flex-col gap-2">
          <h2 className="text-h2">{s.h}</h2>
          <p className="max-w-measure">{s.p}</p>
        </section>
      ))}
      <section className="flex flex-col gap-2">
        <h2 className="text-h2">{lang === 'en' ? 'Corrections' : 'Koreksi'}</h2>
        <p className="max-w-measure">
          {lang === 'en' ? 'Spotted a mistake? ' : 'Menemukan kesalahan? '}
          <a href={`${REPO}/issues`} rel="noopener">
            {lang === 'en' ? 'Open an issue on GitHub.' : 'Laporkan lewat GitHub Issues.'}
          </a>
        </p>
      </section>
    </PageShell>
  );
}
