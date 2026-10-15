'use client';

import { useT } from './ProgressProvider';
import { PageShell } from './ui/PageShell';

const REPO = 'https://github.com/andifathulms/mandarin-ladder';

const copy = {
  id: [
    {
      h: 'Apa ini',
      p: 'Mandarin Ladder adalah kursus bahasa Mandarin bertingkat untuk penutur bahasa Indonesia, mulai dari nol: belum kenal pinyin, belum kenal nada, belum kenal karakter. Dua anak tangga Dasar mengajarkan pinyin, nada, goresan dan radikal. Sesudah itu, setiap anak tangga mengikuti satu level HSK, sampai HSK 9.',
    },
    {
      h: 'Tentang HSK',
      p: 'HSK adalah ujian kemampuan bahasa Mandarin resmi. Tangga ini mengikuti standar HSK 3.0 (2021) yang punya sembilan level: daftar kata, karakter, karakter tulis tangan dan tata bahasanya diambil langsung dari standar itu. Mandarin butuh waktu: untuk kebanyakan orang dewasa Indonesia, HSK 4 biasanya butuh dua tahun belajar dengan tekun, dan HSK 6 empat tahun atau lebih.',
    },
    {
      h: 'Progresmu',
      p: 'Tidak ada akun dan tidak ada pelacakan. Progresmu hanya tersimpan di browser ini. Kamu bisa mengekspor dan mengimpornya di Pengaturan.',
    },
    {
      h: 'Cara pelajaran ditulis',
      p: 'Pelajaran disusun dengan bantuan AI, lalu diperiksa oleh guru bahasa Mandarin sebelum ditandai siap. Pelajaran yang belum diperiksa diberi tanda Draft. Setiap kata dicek terhadap daftar HSK dan kamus CC-CEDICT, dan setiap pinyin terhadap tabel suku kata.',
    },
    {
      h: 'Siapa yang membuat',
      p: 'Dibuat oleh Fathul, saudara dari English Ladder dan Arabic Ladder, untuk orang yang ingin naik pelan-pelan tanpa merasa dihakimi.',
    },
  ],
  en: [
    {
      h: 'What this is',
      p: 'Mandarin Ladder is a levelled Mandarin course for Indonesian speakers, starting from complete zero: no pinyin, no tones, no characters. Two Dasar (foundation) rungs teach pinyin, tones, strokes and radicals. After that, each rung follows one HSK level, up to HSK 9.',
    },
    {
      h: 'About HSK',
      p: 'HSK is the official Mandarin proficiency exam. This ladder follows the HSK 3.0 standard (2021), which has nine levels: its word, character, handwriting and grammar lists are taken straight from the standard. Mandarin takes time: for most Indonesian adults, HSK 4 usually takes two years of steady study, and HSK 6 four years or more.',
    },
    {
      h: 'Your progress',
      p: 'There are no accounts and no tracking. Your progress lives only in this browser. You can export and import it in Settings.',
    },
    {
      h: 'How lessons are written',
      p: 'Lessons are drafted with AI help, then checked by a Mandarin teacher before they are marked ready. Lessons not yet checked carry a Draft badge. Every word is checked against the HSK lists and the CC-CEDICT dictionary, and every pinyin syllable against the syllable table.',
    },
    {
      h: 'Who made it',
      p: 'Made by Fathul, as a sibling of English Ladder and Arabic Ladder, for people who want to climb slowly without feeling judged.',
    },
  ],
};

/** Third-party data and fonts, with their licences (CLAUDE.md §8). */
const CREDITS: { name: string; href: string; what: { id: string; en: string }; licence: string }[] = [
  {
    name: 'HSK 3.0 (GF 0025—2021)',
    href: 'http://www.moe.gov.cn/jyb_xwfb/gzdt_gzdt/s5987/202103/W020210329527301787356.pdf',
    what: { id: 'Daftar kata, karakter, tulis tangan dan tata bahasa per level', en: 'Word, character, handwriting and grammar lists per level' },
    licence: 'Standar nasional · transkripsi krmanik/HSK-3.0 (CC BY-SA 4.0)',
  },
  {
    name: 'CC-CEDICT',
    href: 'https://cc-cedict.org/',
    what: { id: 'Pengecekan pinyin, karakter tradisional, kata penggolong', en: 'Pinyin checks, traditional characters, measure words' },
    licence: 'CC BY-SA 4.0',
  },
  {
    name: 'Make Me a Hanzi',
    href: 'https://github.com/skishore/makemeahanzi',
    what: { id: 'Data goresan dan komponen karakter', en: 'Stroke and component data' },
    licence: 'Arphic Public License (grafik) · LGPL (kamus)',
  },
  {
    name: 'audio-cmn',
    href: 'https://github.com/hugolpz/audio-cmn',
    what: { id: 'Rekaman suku kata (suara Chen Wang)', en: 'Syllable recordings (voice: Chen Wang)' },
    licence: 'CC BY-SA',
  },
  {
    name: 'LXGW WenKai 霞鹜文楷',
    href: 'https://github.com/lxgw/LxgwWenKai',
    what: { id: 'Huruf karakter untuk mengajar', en: 'Teaching typeface for characters' },
    licence: 'SIL Open Font License 1.1',
  },
  {
    name: 'Noto Sans SC',
    href: 'https://github.com/notofonts/noto-cjk',
    what: { id: 'Huruf karakter kecil di antarmuka', en: 'Small interface hanzi' },
    licence: 'SIL Open Font License 1.1',
  },
];

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
      <section className="flex flex-col gap-3">
        <h2 className="text-h2">{lang === 'en' ? 'Data, fonts and audio' : 'Data, huruf dan audio'}</h2>
        <ul className="card flex flex-col divide-y divide-rule overflow-hidden">
          {CREDITS.map((c) => (
            <li key={c.name} className="flex flex-col gap-1 px-4 py-3">
              <a href={c.href} rel="noopener" className="font-bold">
                {c.name}
              </a>
              <span className="text-small">{c.what[lang]}</span>
              <span className="label text-muted">{c.licence}</span>
            </li>
          ))}
        </ul>
        <p className="max-w-measure text-small text-muted">
          {lang === 'en'
            ? 'Nothing is fetched from these sources while you use the app: the data, fonts and recordings ship with it.'
            : 'Tidak ada yang diambil dari sumber-sumber ini saat kamu memakai aplikasi: data, huruf dan rekamannya ikut dikemas.'}
        </p>
      </section>
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
