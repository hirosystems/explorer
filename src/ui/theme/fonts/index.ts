import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
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
