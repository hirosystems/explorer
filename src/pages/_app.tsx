import * as React from 'react';
import 'tippy.js/dist/tippy.css'; // optional
import { RecoilRoot, useRecoilValue } from 'recoil';
import type { AppProps } from 'next/app';

import { AppWrapper } from '@components/app-init';
import 'modern-normalize/modern-normalize.css';

import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { apiServerState } from '@store/recoil';

const AppContainer: React.FC<any> = ({ component: Component, ...props }) => {
  const apiServer = useRecoilValue(apiServerState);
  return (
    <CacheProvider value={cache}>
      <AppWrapper colorMode="light">
        <Component apiServer={apiServer} {...props} />
      </AppWrapper>
    </CacheProvider>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AppContainer component={Component} {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
