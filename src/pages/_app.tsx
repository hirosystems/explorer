import type { AppContext } from 'next/app';

import { ErrorBoundary } from 'react-error-boundary';
import { PageWrapper } from '@/appPages/PageWrapper';
import { Providers } from '@/appPages/Providers';
import AppError from '@/appPages/error';
import { IS_BROWSER } from '@/common/constants';
import { NetworkModeUrlMap } from '@/common/constants/network';
import { AppContextProvider } from '@/common/context/GlobalContext';
import { NetworkModes } from '@/common/types/network';
import { FC, ReactNode } from 'react';

function ExplorerApp({
  Component,
  cookies,
  apiUrls,
  queryNetworkMode,
  queryApiUrl,
  querySubnet,
  pageProps,
}: {
  Component: FC;
  cookies: string;
  apiUrls: Record<NetworkModes, string>;
  queryNetworkMode: NetworkModes;
  queryApiUrl: string;
  querySubnet: string;
  pageProps: Record<string, unknown>;
}) {
  return (
    <ErrorBoundary
      fallbackRender={({
        error,
        resetErrorBoundary,
      }: {
        error: Error;
        resetErrorBoundary: () => void;
      }) => <AppError error={error} reset={resetErrorBoundary} />}
    >
      <AppContextProvider
        cookies={cookies}
        apiUrls={apiUrls}
        queryNetworkMode={queryNetworkMode}
        queryApiUrl={queryApiUrl}
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
  const { query } = appContext.ctx;
  const queryNetworkMode = ((Array.isArray(query.chain) ? query.chain[0] : query.chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = Array.isArray(query.api) ? query.api[0] : query.api;
  const querySubnet = Array.isArray(query.subnet) ? query.subnet[0] : query.subnet;
  return {
    cookies: appContext.ctx.req?.headers?.cookie || (IS_BROWSER ? document?.cookie : ''),
    apiUrls: NetworkModeUrlMap,
    queryNetworkMode,
    queryApiUrl,
    querySubnet,
  };
};

export default ExplorerApp;
