import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import 'tippy.js/dist/tippy.css';
import 'modern-normalize/modern-normalize.css';

import { AtomDebug, Devtools } from '@features/devtools';
import { AppConfig } from '@components/app-config';
import { NetworkMode } from '@common/types/network';
import { NetworkModeToast } from '@components/network-mode-toast';
import { Modals } from '@components/modals';
import { wrapper } from '@common/state/store';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { EnhancedStore } from '@reduxjs/toolkit';
import { ParsedUrlQuery } from 'querystring';
import { setActiveNetwork } from '@common/state/network-slice';
import { DEFAULT_NETWORK_MAP, NetworkModeUrlMap } from '@common/constants/network';

interface ExplorerAppProps extends AppProps {
  apiServer: string;
  networkMode: NetworkMode;
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

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Hydrate state={pageProps.dehydratedState}>
          <Devtools />
          <AppConfig isHome={isHome} fullWidth={fullWidth}>
            <AtomDebug />
            <Component apiServer={apiServer} networkMode={networkMode} {...props} />
            <Modals />
            <NetworkModeToast />
          </AppConfig>
        </Hydrate>
      </Provider>
    </QueryClientProvider>
  );
}

const handleNetworkModeQueryParam = (store: EnhancedStore, query: ParsedUrlQuery) => {
  const activeNetwork = store.getState().global.networks[store.getState().global.activeNetworkKey];
  const queryNetworkMode = (Array.isArray(query.chain) ? query.chain[0] : query.chain) || '';
  if (queryNetworkMode !== activeNetwork.mode) {
    // query param overrides state
    store.dispatch(setActiveNetwork(DEFAULT_NETWORK_MAP[NetworkModeUrlMap[queryNetworkMode]]));
  }
};

ExplorerApp.getInitialProps = wrapper.getInitialAppProps(
  store => async (appContext: AppContext) => {
    const appProps = await App.getInitialProps(appContext);
    handleNetworkModeQueryParam(store, appContext.ctx.query);
    return {
      ...appProps,
      ...appProps.pageProps,
    };
  }
);

export default ExplorerApp;
