import * as React from 'react';
import { RecoilRoot } from 'recoil';
import { AppWrapper } from '@components/app-init';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import './styles.css';
import 'tippy.js/dist/tippy.css'; // optional
import 'modern-normalize/modern-normalize.css';

const AppContainer: React.FC<any> = ({ component: Component, networkMode, isHome, ...props }) => {
  return (
    <CacheProvider value={cache}>
      <AppWrapper isHome={isHome}>
        <Component {...props} />
      </AppWrapper>
    </CacheProvider>
  );
};

function MyApp({ Component, pageProps, networkMode }: { networkMode: string } & AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        suspense: false,
      }}
    >
      <RecoilRoot>
        <AppContainer networkMode={networkMode} component={Component} {...pageProps} />
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
