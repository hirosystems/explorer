import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

import { meta } from '../common/constants/meta';
import {
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeUrlMap,
} from '../common/constants/network';
import { AppContextProvider } from '../common/context/GlobalContext';
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
      <GoogleAnalytics gaId="G-NB2VBT0KY2" />
      <script
        async
        type="text/javascript"
        src="https://www.lightboxcdn.com/vendor/94b8df2e-6c46-4cd4-b3dc-ecb7c357ccaf/lightbox_speed.js"
      ></script>
    </html>
  );
}
