import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { fontVariables } from './fonts';
import { THEME_COLOR, themeScript } from './themeScript';
import { withBase } from '@/lib/basePath';
import { ProgressProvider } from '@/components/ProgressProvider';

export const metadata: Metadata = {
  title: { default: 'Mandarin Ladder', template: '%s · Mandarin Ladder' },
  description: 'Kursus bahasa Mandarin bertingkat untuk penutur bahasa Indonesia, dari nol sampai HSK 9. Pelan-pelan, tapi naik.',
  manifest: withBase('/manifest.webmanifest'),
  icons: { icon: withBase('/icons/icon.svg'), apple: withBase('/icons/icon-192.png') },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      dir="ltr"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* One theme-color, set from the in-app theme by the theme script and applySettings. */}
        <meta name="theme-color" content={THEME_COLOR.light} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
