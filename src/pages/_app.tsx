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
import { useChainModeEffect } from '@common/hooks/use-chain-mode';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';
import { appGetInitialProps, setCurrentNetworkMode } from '@common/app-helpers';

const AppContainer: React.FC<any> = ({ component: Component, networkMode, isHome, ...props }) => {
  useChainModeEffect();
  return (
    <CacheProvider value={cache}>
      <AppWrapper isHome={isHome}>
        <Component {...props} />
      </AppWrapper>
    </CacheProvider>
  );
};

function MyApp({ Component, pageProps, networkMode }: { networkMode: string } & AppProps) {
  React.useMemo(() => {
    setCurrentNetworkMode(networkMode);
  }, []);

  return (
    <SWRConfig
      value={{
        refreshInterval: DEFAULT_POLLING_INTERVAL,
        suspense: false,
      }}
    >
      <RecoilRoot>
        <AppContainer networkMode={networkMode} component={Component} {...pageProps} />
      </RecoilRoot>
    </SWRConfig>
  );
}

MyApp.getInitialProps = appGetInitialProps;

export default MyApp;
