'use client';

import { store } from '@/common/state/store';
import { AppConfig } from '@/components/app-config';
import { UIProvider } from '@/ui/UIProvider';
import * as React from 'react';
import { FC } from 'react';
import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 5000,
      suspense: true,
    },
  },
});
export const Providers: FC<any> = ({
  children,
  cookies,
  queryNetworkMode,
  queryApiUrl,
  querySubnet,
  apiUrls,
}) => {
  return (
    <CookiesProvider>
      <UIProvider cookies={cookies}>
        <Provider store={store}>
          <AppConfig
            queryNetworkMode={queryNetworkMode}
            queryApiUrl={queryApiUrl}
            querySubnet={querySubnet}
          >
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </AppConfig>
        </Provider>
      </UIProvider>
    </CookiesProvider>
  );
};
