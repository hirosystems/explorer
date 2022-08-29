import 'modern-normalize/modern-normalize.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Provider } from 'react-redux';
import 'tippy.js/dist/tippy.css';

import { DEFAULT_NETWORK_MAP, NetworkModeUrlMap } from '@common/constants/network';
import {
  selectActiveNetwork,
  selectActiveNetworkUrl,
  selectNetworks,
  setActiveNetwork,
} from '@common/state/network-slice';
import { wrapper } from '@common/state/store';
import { NetworkMode, NetworkModes } from '@common/types/network';
import { AppConfig } from '@components/app-config';
import { Modals } from '@components/modals';
import { NetworkModeToast } from '@components/network-mode-toast';
import { AtomDebug } from '@features/devtools';
import { EnhancedStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

interface ExplorerAppProps extends AppProps {
  apiServer: string;
  networkMode: NetworkMode;
  pageProps: any;
}

function ExplorerApp({ Component, ...rest }: ExplorerAppProps): React.ReactElement {
  const { apiServer, networkMode, pageProps } = rest;
  const { isHome, fullWidth } = pageProps;
  const { store, props } = wrapper.useWrappedStore(rest);

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5000,
          },
        },
      })
  );
  const router = useRouter();

  useEffect(() => {
    const chain = router.query.chain;
    toast(`You're viewing the ${chain || networkMode} Explorer`);
  }, []);

  console.log('[debug] pageProps.dehydratedState', pageProps.dehydratedState);
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Hydrate state={pageProps.dehydratedState}>
          <AppConfig isHome={isHome} fullWidth={fullWidth}>
            <AtomDebug />
            <Component apiServer={apiServer} networkMode={networkMode} {...props} />
            <Modals />
            <NetworkModeToast />
          </AppConfig>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}

const handleNetworkModeQueryParam = (store: EnhancedStore, appContext: AppContext) => {
  if (appContext.ctx.pathname === '/_error') return;
  const query = appContext.ctx.query;
  const activeNetwork = selectActiveNetwork(store.getState());
  const networks = selectNetworks(store.getState());
  console.log('[debug] selectActiveNetworkUrl', selectActiveNetworkUrl(store.getState()));
  console.log('[debug] activeNetwork', activeNetwork);
  console.log('[debug] networks', networks);
  const queryNetworkMode = ((Array.isArray(query.chain) ? query.chain[0] : query.chain) ||
    '') as NetworkModes;
  if (queryNetworkMode !== activeNetwork?.mode || !networks[activeNetwork.url]) {
    // query param overrides state
    console.log(
      '[debug] network conflict',
      queryNetworkMode,
      activeNetwork,
      DEFAULT_NETWORK_MAP,
      NetworkModeUrlMap
    );
    store.dispatch(setActiveNetwork(DEFAULT_NETWORK_MAP[NetworkModeUrlMap[queryNetworkMode]]));
  }
};

ExplorerApp.getInitialProps = wrapper.getInitialAppProps(
  store => async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);
    handleNetworkModeQueryParam(store, appContext);
    return {
      ...appProps,
      ...appProps.pageProps,
    };
  }
);

export default ExplorerApp;
