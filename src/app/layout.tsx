import { Metadata } from 'next';
import { headers } from 'next/headers';
import * as React from 'react';
import { ReactNode } from 'react';

import { meta } from '../common/constants/meta';
import {
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
} from '../common/constants/network';
import { AppContextProvider } from '../common/context/GlobalContext';
import { Analytics } from './_components/Analytics';
import { GA } from './_components/GA';
import { PageWrapper } from './_components/PageWrapper';
import { Providers } from './_components/Providers';
import { getTokenPrice } from './getTokenPriceInfo';
import './global.css';

export async function generateMetadata(): Promise<Metadata> {
  return Promise.resolve(meta);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const tokenPrice = await getTokenPrice();
  return (
    <html lang="en">
      <body>
        <AppContextProvider
          headerCookies={headersList.get('cookie')}
          apiUrls={NetworkModeUrlMap} // TODO: why does this need to be in context? remove. make a function that returns these. network should be in redux not context
          btcBlockBaseUrls={NetworkModeBtcBlockBaseUrlMap} // TODO: why does this need to be in context? remove. make a function that returns these. network should be in redux not context
          btcTxBaseUrls={NetworkModeBtcTxBaseUrlMap} // TODO: why does this need to be in context? remove. make a function that returns these. network should be in redux not context
          btcAddressBaseUrls={NetworkModeBtcAddressBaseUrlMap} // TODO: why does this need to be in context? remove. make a function that returns these. network should be in redux not context
        >
          <Providers headerCookies={headersList.get('cookie')}>
            <PageWrapper tokenPrice={tokenPrice}>{children}</PageWrapper>
          </Providers>
        </AppContextProvider>
      </body>
      <GA />
      <Analytics />
    </html>
  );
}
