import React, { memo } from 'react';
import { RecoilRoot } from 'recoil';
import { AppContainer } from '@components/app-container';
import { SWRConfig } from 'swr';
import { DefaultOptions, QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { DEFAULT_POLLING_INTERVAL } from '@common/constants';

const config: DefaultOptions['queries'] = {
  refetchInterval: DEFAULT_POLLING_INTERVAL,
  keepPreviousData: true,
  notifyOnChangeProps: ['data'],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: config,
  },
});

interface AppConfigProps {
  isHome?: boolean;
  dehydratedState?: any;
}

export const AppConfig: React.FC<AppConfigProps> = memo(({ children, isHome, dehydratedState }) => (
  <SWRConfig
    value={{
      refreshInterval: DEFAULT_POLLING_INTERVAL,
      suspense: false,
    }}
  >
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState && eval(dehydratedState)}>
          <CacheProvider value={cache}>
            <AppContainer isHome={isHome}>{children}</AppContainer>
          </CacheProvider>
        </Hydrate>
      </QueryClientProvider>
    </RecoilRoot>
  </SWRConfig>
));
