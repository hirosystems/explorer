import { GoogleAnalytics } from '@next/third-parties/google';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

import { meta } from '../common/constants/meta';
import { GlobalContextProvider } from '../common/context/GlobalContextProvider';
import { PageWrapper } from './_components/PageWrapper';
import { Providers } from './_components/Providers';
import { getStatusBarContent } from './getStatusBarContent';
import { getTokenPrice } from './getTokenPriceInfo';
import './global.css';

export async function generateMetadata(): Promise<Metadata> {
  return Promise.resolve(meta);
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const tokenPrice = await getTokenPrice();
  const statusBarContent = await getStatusBarContent();
  return (
    <html lang="en">
      <body>
        <GlobalContextProvider headerCookies={headersList.get('cookie')}>
          <Providers headerCookies={headersList.get('cookie')}>
            <PageWrapper tokenPrice={tokenPrice} statusBarContent={statusBarContent}>
              {children}
            </PageWrapper>
          </Providers>
        </GlobalContextProvider>
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
