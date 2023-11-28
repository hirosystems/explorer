import { Metadata } from 'next';
import { headers } from 'next/headers';
import { ReactNode } from 'react';
import * as React from 'react';

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
import { GlobalStyles, PrismTheme, TextAreaOverrides } from './_components/GlobalStyles';
import { PageWrapper } from './_components/PageWrapper';
import { Providers } from './_components/Providers';

export async function generateMetadata(): Promise<Metadata> {
  return Promise.resolve(meta);
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const headersList = headers();
  return (
    <html lang="en">
      {GlobalStyles}
      {TextAreaOverrides}
      {PrismTheme}
      <body>
        <AppContextProvider
          headerCookies={headersList.get('cookie')}
          apiUrls={NetworkModeUrlMap}
          btcBlockBaseUrls={NetworkModeBtcBlockBaseUrlMap}
          btcTxBaseUrls={NetworkModeBtcTxBaseUrlMap}
          btcAddressBaseUrls={NetworkModeBtcAddressBaseUrlMap}
        >
          <Providers headerCookies={headersList.get('cookie')}>
            <PageWrapper>{children}</PageWrapper>
          </Providers>
        </AppContextProvider>
      </body>
      <GA />
      <Analytics />
    </html>
  );
}
