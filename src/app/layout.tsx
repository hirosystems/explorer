import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import { meta } from '../common/constants/meta';
import {
  instrumentSans,
  inter,
  matterMonoRegular,
  matterRegular,
  openSauce,
} from '../common/fonts';
import { PageWrapper } from './_components/PageWrapper';
import { Providers } from './_components/Providers';
import { getStatusBarContent } from './getStatusBarContent';
import { getTokenPrice } from './getTokenPriceInfo';
import './global.css';

export async function generateMetadata(): Promise<Metadata> {
  return Promise.resolve(meta);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('stacks-explorer-theme')?.value || 'light';
  const addedCustomNetworksCookie = cookieStore.get('addedCustomNetworks')?.value;
  const removedCustomNetworksCookie = cookieStore.get('removedCustomNetworks')?.value;

  // Environment debugging - shows once per layout render
  const nodeEnv = process.env.NODE_ENV || 'unknown';
  const vercelEnv = process.env.VERCEL_ENV || 'not-set';
  const nextRuntime = process.env.NEXT_RUNTIME || 'nodejs';
  console.log(`🌍 Layout render - ENV: ${nodeEnv}, VERCEL: ${vercelEnv}, RUNTIME: ${nextRuntime}`);

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
    </html>
  );
}
