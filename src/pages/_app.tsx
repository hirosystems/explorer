import { createTxFilterSlice } from '@features/transactions-filter/transactions-filter-slice';
import 'modern-normalize/modern-normalize.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import 'tippy.js/dist/tippy.css';

import { NetworkModeUrlMap } from '@common/constants/network';
import { ApiUrls, initialize, selectActiveNetworkUrl } from '@common/state/network-slice';
import { store } from '@common/state/store';
import { NetworkMode, NetworkModes } from '@common/types/network';

import { AppConfig } from '@components/app-config';
import { Modals } from '@components/modals';
import { NetworkModeToast } from '@components/network-mode-toast';

interface ExplorerAppProps extends AppProps {
  apiUrls: ApiUrls;
  queryNetworkMode: NetworkMode;
  queryApiUrl?: string;
  pageProps: any;
}

function ExplorerApp({ Component, ...rest }: ExplorerAppProps) {
  const { apiUrls, queryNetworkMode, queryApiUrl, pageProps } = rest;
  const { fullWidth } = pageProps;
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
    toast(`You're viewing the ${chain || queryNetworkMode} Explorer`);
  }, [queryNetworkMode, router.query.chain]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppConfig queryNetworkMode={queryNetworkMode} queryApiUrl={queryApiUrl} apiUrls={apiUrls}>
          <Component {...pageProps} />
          <Modals />
          <NetworkModeToast />
        </AppConfig>
        <ReactQueryDevtools initialIsOpen={false} />
      </Provider>
    </QueryClientProvider>
  );
}

const getSearchParamsFromNextUrl = (url: string | undefined) => {
  if (!url) {
    return {};
  }
  const searchParamsString = url.split('?')[1];
  if (!searchParamsString) {
    return {};
  }

  const searchParamsArray = searchParamsString.split('&');
  if (!searchParamsArray) {
    return {};
  }

  const searchParams: Record<string, string> = {};
  searchParamsArray.forEach(param => {
    const keyValueTuple = param.split('=');
    const key = keyValueTuple[0];
    const value = keyValueTuple[1];
    searchParams[key] = value;
  });

  return searchParams;
};

const getNetworkMode = (chain: string) => {
  if (chain === NetworkModes.Devnet) return NetworkModes.Devnet;
  else if (chain === NetworkModes.Mainnet) return NetworkModes.Mainnet;
  else if (chain === NetworkModes.Testnet) return NetworkModes.Testnet;
  else return undefined;
};

ExplorerApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const query = appContext.ctx.query;

  const nextUrl = appContext.ctx.req?.url || '';
  const searchParams = getSearchParamsFromNextUrl(nextUrl);
  const chain = searchParams.chain;
  const networkModeFromNextUrl = chain ? getNetworkMode(chain) : undefined;
  const api = searchParams.api;

  // const nextUrl = new URL(appContext.ctx.req?.url ?? '');
  // const chain = nextUrl.searchParams.get('chain');
  // const networkModeFromNextUrl = chain ? getNetworkMode(chain) : undefined;
  // const api = nextUrl.searchParams.get('api');

  // const nextUrl = appContext.ctx.req?.url;
  // const nextUrl = window.location;

  // const searchParams = new URLSearchParams(nextUrl ?? '');
  // const chain = searchParams.get('chain');
  // const networkModeFromNextUrl = chain ? getNetworkMode(chain) : undefined;
  // const api = searchParams.get('api');

  // console.log({
  //   nextUrl,
  //   searchParams,
  //   chain,
  //   networkModeFromNextUrl,
  //   api,
  //   queryChain: query.chain,
  //   queryApi: query.api,
  //   keys: searchParams.keys(),
  //   url: appContext.ctx.req?.url,
  //   query: appContext.ctx.query,
  //   windowLocation: window.location,
  // });

  const queryNetworkMode = Array.isArray(query.chain)
    ? (query.chain[0] as NetworkModes)
    : query.chain
    ? (query.chain as NetworkModes)
    : networkModeFromNextUrl
    ? networkModeFromNextUrl
    : NetworkModes.Mainnet;
  // const queryNetworkMode = Array.isArray(query.chain)
  //   ? (query.chain[0] as NetworkModes)
  //   : (query.chain as NetworkModes);

  const queryApiUrl = Array.isArray(query.api)
    ? query.api[0]
    : query.api
    ? query.api
    : api
    ? api
    : undefined;
  // const queryApiUrl = Array.isArray(query.api) ? query.api[0] : query.api;

  store.dispatch(initialize({ queryNetworkMode, apiUrls: NetworkModeUrlMap, queryApiUrl }));
  console.log(
    '[debug] store.getState().network',
    JSON.stringify(store.getState().network, null, 4)
  );
  console.log('[debug] NetworkModeUrlMap', JSON.stringify(NetworkModeUrlMap, null, 4));
  console.log('[debug] selectActiveNetworkUrl', selectActiveNetworkUrl(store.getState()));
  console.log('[debug] queryNetworkMode', queryNetworkMode);
  console.log('[debug] queryApiUrl', queryApiUrl);
  console.log('[debug] query', query);

  return {
    ...appProps,
    ...appProps.pageProps,
    apiUrls: NetworkModeUrlMap,
    queryNetworkMode,
    queryApiUrl,
  };
};

export default ExplorerApp;
