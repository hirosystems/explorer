import { PageWrapper } from '@/app/PageWrapper';
import { Providers } from '@/app/Providers';
import AppError from '@/app/error';
import { IS_BROWSER } from '@/common/constants';
import { NetworkModeUrlMap } from '@/common/constants/network';
import { AppContextProvider } from '@/common/context/GlobalContext';
import { NetworkModes } from '@/common/types/network';
import type { AppContext } from 'next/app';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ExplorerApp({ Component, cookies, apiUrls, queryNetworkMode, queryApiUrl }: any) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AppError error={error} reset={resetErrorBoundary} />
      )}
    >
      <AppContextProvider
        cookies={cookies}
        apiUrls={apiUrls}
        queryNetworkMode={queryNetworkMode}
        queryApiUrl={queryApiUrl}
      >
        <Providers
          cookies={cookies}
          queryNetworkMode={queryNetworkMode}
          queryApiUrl={queryApiUrl}
          apiUrls={apiUrls}
        >
          <PageWrapper>
            <Component />
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
  return {
    cookies: appContext.ctx.req?.headers?.cookie || (IS_BROWSER ? document?.cookie : ''),
    apiUrls: NetworkModeUrlMap,
    queryNetworkMode,
    queryApiUrl,
  };
};

export default ExplorerApp;
