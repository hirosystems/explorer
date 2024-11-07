import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Metadata } from 'next';
import { Instrument_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { meta } from '../common/constants/meta';
import { PageWrapper } from './_components/PageWrapper';
import { Providers } from './_components/Providers';
import { getStatusBarContent } from './getStatusBarContent';
import { getTokenPrice } from './getTokenPriceInfo';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

const openSauce = localFont({
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

const matterRegular = localFont({
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

const matterMonoRegular = localFont({
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

export async function generateMetadata(): Promise<Metadata> {
  return Promise.resolve(meta);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const themeCookie = cookies().get('stacks-explorer-theme')?.value || 'light';
  const addedCustomNetworksCookie = cookies().get('addedCustomNetworks')?.value;
  const removedCustomNetworksCookie = cookies().get('removedCustomNetworks')?.value;

  const tokenPrice = await getTokenPrice();
  const statusBarContent = await getStatusBarContent();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSans.variable} ${openSauce.variable} ${matterRegular.variable} ${matterMonoRegular.variable}`}
    >
      <body>
        <Providers
          addedCustomNetworksCookie={addedCustomNetworksCookie}
          removedCustomNetworksCookie={removedCustomNetworksCookie}
        >
          <PageWrapper
            tokenPrice={tokenPrice}
            statusBarContent={statusBarContent}
            serverThemeCookie={themeCookie}
          >
            {children}
          </PageWrapper>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-NB2VBT0KY2" />
      <GoogleTagManager gtmId="GTM-W534HQ4X" />
      {/* <script
        async
        type="text/javascript"
        src="https://www.lightboxcdn.com/vendor/94b8df2e-6c46-4cd4-b3dc-ecb7c357ccaf/lightbox_speed.js"
      ></script> */}
    </html>
  );
}
