import { PageWrapper } from '@/app/PageWrapper';
import { Providers } from '@/app/Providers';
import AppError from '@/app/error';
import { IS_BROWSER } from '@/common/constants';
import {
  NetworkModeBtcBlockBaseUrlMap,
  NetworkModeBtcTxBaseUrlMap,
  NetworkModeBtcAddressBaseUrlMap,
  NetworkModeUrlMap,
} from '@/common/constants/network';
import { AppContextProvider } from '@/common/context/GlobalContext';
import { NetworkModes } from '@/common/types/network';
import type { AppContext } from 'next/app';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ExplorerApp({
  Component,
  cookies,
  apiUrls,
  btcBlockBaseUrls,
  btcTxBaseUrls,
  btcAddressBaseUrls,
  queryNetworkMode,
  queryApiUrl,
  queryBtcBlockBaseUrl,
  queryBtcTxBaseUrl,
  queryBtcAddressBaseUrl,
  querySubnet,
  pageProps,
}: any) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppContextProvider
        cookies={cookies}
        apiUrls={apiUrls}
        btcBlockBaseUrls={btcBlockBaseUrls}
        btcTxBaseUrls={btcTxBaseUrls}
        btcAddressBaseUrls={btcAddressBaseUrls}
        queryNetworkMode={queryNetworkMode}
        queryApiUrl={queryApiUrl}
        queryBtcBlockBaseUrl={queryBtcBlockBaseUrl}
        queryBtcTxBaseUrl={queryBtcTxBaseUrl}
        queryBtcAddressBaseUrl={queryBtcAddressBaseUrl}
        querySubnet={querySubnet}
      >
        <Providers
          cookies={cookies}
          queryNetworkMode={queryNetworkMode}
          queryApiUrl={queryApiUrl}
          apiUrls={apiUrls}
          querySubnet={querySubnet}
        >
          <PageWrapper>
            <Component {...pageProps} />
          </PageWrapper>
        </Providers>
      </AppContextProvider>
    </ErrorBoundary>
  );
}

ExplorerApp.getInitialProps = (appContext: AppContext) => {
  const query = appContext.ctx.query;
  const queryNetworkMode = ((Array.isArray(query.chain) ? query.chain[0] : query.chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = Array.isArray(query.api) ? query.api[0] : query.api;
  const querySubnet = Array.isArray(query.subnet) ? query.subnet[0] : query.subnet;
  const queryBtcBlockBaseUrl = Array.isArray(query.queryBtcBlockBaseUrl)
    ? query.queryBtcBlockBaseUrl[0]
    : query.queryBtcBlockBaseUrl;
  const queryBtcTxBaseUrl = Array.isArray(query.queryBtcTxBaseUrl)
    ? query.queryBtcTxBaseUrl[0]
    : query.queryBtcTxBaseUrl;
  const queryBtcAddressBaseUrl = Array.isArray(query.queryBtcAddressBaseUrl)
    ? query.queryBtcAddressBaseUrl[0]
    : query.queryBtcAddressBaseUrl;
  return {
    cookies: appContext.ctx.req?.headers?.cookie || (IS_BROWSER ? document?.cookie : ''),
    apiUrls: NetworkModeUrlMap,
    btcBlockBaseUrls: NetworkModeBtcBlockBaseUrlMap,
    btcTxBaseUrls: NetworkModeBtcTxBaseUrlMap,
    btcAddressBaseUrls: NetworkModeBtcAddressBaseUrlMap,
    queryNetworkMode,
    queryApiUrl,
    queryBtcBlockBaseUrl,
    queryBtcTxBaseUrl,
    queryBtcAddressBaseUrl,
    querySubnet,
  };
};

export default ExplorerApp;
