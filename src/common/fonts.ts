import { Instrument_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

export const openSauce = localFont({
  src: [
    {
      path: '../ui/theme/fonts/opensaucesans-medium-webfont.woff2',
      weight: '500',
    },
    {
      path: '../ui/theme/fonts/opensaucesans-regular-webfont.woff2',
      weight: '400',
    },
  ],
  variable: '--font-open-sauce',
});

export const matterRegular = localFont({
  src: [
    {
      path: '../ui/theme/fonts/matter-regular.woff',
      weight: '500',
    },
    {
      path: '../ui/theme/fonts/matter-regular.woff2',
      weight: '400',
    },
  ],
  variable: '--font-matter',
});

export const matterMonoRegular = localFont({
  src: [
    {
      path: '../ui/theme/fonts/matter-mono-regular.woff',
      weight: '500',
    },
    {
      path: '../ui/theme/fonts/matter-mono-regular.woff2',
      weight: '400',
    },
  ],
  variable: '--font-matter-mono',
});
