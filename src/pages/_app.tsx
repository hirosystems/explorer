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
import { getServerSideApiServer } from '@common/api/utils';
import { getNetworkMode } from '@common/api/network';
import { atom } from 'recoil';
import { useRouter } from 'next/router';
import App from 'next/app';

/**
 * This is an awful hack that will hopefully be removed in the future
 *
 * With Recoil and SSR, setting an initial value on the server is not easy nor straightforward.
 * @see https://github.com/facebookexperimental/Recoil/issues/750
 * @see https://gist.github.com/spro/280e06758099a05b3bfb6e876e919f2e
 */
let CURRENT_NETWORK_MODE: any = null;

const initialEffect = (key: string) => ({ setSelf }: any) => {
  if (CURRENT_NETWORK_MODE !== null) setSelf(CURRENT_NETWORK_MODE);
};

export const networkModeState = atom({
  key: 'app/network.mode',
  default: null,
  effects_UNSTABLE: [initialEffect('network.mode')],
});

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
  const router = useRouter();
  React.useMemo(() => {
    CURRENT_NETWORK_MODE = networkMode;
  }, []);

  const isBrowser = typeof document !== 'undefined';

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!router?.query?.chain || router?.query?.chain !== networkMode.toLowerCase()) {
        void router.replace(
          `${document.location.pathname}?chain=${networkMode.toLowerCase()}`,
          `${document.location.pathname}?chain=${networkMode.toLowerCase()}`,
          {
            shallow: true,
          }
        );
      }
    }
  }, [router.query, isBrowser]);
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

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);

  try {
    const apiServer = await getServerSideApiServer(appContext);
    const mode = await getNetworkMode(apiServer);
    return { networkMode: mode, ...appProps };
  } catch (e) {
    return { ...appProps };
  }
};

export default MyApp;
