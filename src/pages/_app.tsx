import * as React from 'react';
import { RecoilRoot } from 'recoil';
import { AppWrapper } from '@components/app-init';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { useApiServer } from '@common/hooks/use-api';
import { SWRConfig } from 'swr';

import type { AppProps } from 'next/app';

import './styles.css';
import 'tippy.js/dist/tippy.css'; // optional
import 'modern-normalize/modern-normalize.css';

const AppContainer: React.FC<any> = ({ component: Component, ...props }) => {
  const apiServer = useApiServer();
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
    <SWRConfig
      value={{
        refreshInterval: 3000,
      }}
    >
      <RecoilRoot>
        <AppContainer component={Component} {...pageProps} />
      </RecoilRoot>
    </SWRConfig>
  );
}

export default MyApp;
