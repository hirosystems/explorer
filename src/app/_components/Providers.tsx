'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { FC, ReactNode } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';

import { IS_BROWSER } from '../../common/constants/constants';
import { store } from '../../common/state/store';
import { NetworkModes } from '../../common/types/network';
import { UIProvider } from '../../ui/UIProvider';
import { AppConfig } from './AppConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 5000,
    },
  },
});
export const Providers: FC<{ headerCookies: string | null; children: ReactNode }> = ({
  children,
  headerCookies,
}) => {
  const cookies = headerCookies || (IS_BROWSER ? document?.cookie : '');
  const searchParams = useSearchParams();
  const chain = searchParams?.get('chain');
  const api = searchParams?.get('api');
  const subnet = searchParams?.get('subnet');

  const queryNetworkMode = ((Array.isArray(chain) ? chain[0] : chain) ||
    NetworkModes.Mainnet) as NetworkModes;
  const queryApiUrl = Array.isArray(api) ? api[0] : api;
  const querySubnet = Array.isArray(subnet) ? subnet[0] : subnet;
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
