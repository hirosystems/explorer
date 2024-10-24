import { Instrument_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const openSauce = localFont({
  src: [
    {
      path: './opensaucesans-medium-webfont.woff2',
      weight: '500',
    },
    {
      path: './opensaucesans-regular-webfont.woff2',
      weight: '400',
    },
  ],
});

export const matterRegular = localFont({
  src: [
    {
      path: './matter-regular.woff',
      weight: '500',
    },
    {
      path: './matter-regular.woff2',
      weight: '400',
    },
  ],
});

export const matterMonoRegular = localFont({
  src: [
    {
      path: './matter-mono-regular.woff',
      weight: '500',
    },
    {
      path: './matter-mono-regular.woff2',
      weight: '400',
    },
  ],
});
