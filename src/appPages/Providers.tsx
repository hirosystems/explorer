import { CookiesProvider } from 'react-cookie';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { UIProvider } from '@/ui/UIProvider';
import { AppConfig } from '@/components/app-config';
import { store } from '@/common/state/store';
import { NetworkMode } from '@/common/types/network';
import { ReactNode } from 'react';

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
export function Providers({
  children,
  cookies,
  queryNetworkMode,
  queryApiUrl,
  querySubnet,
  apiUrls,
}: {
  children: ReactNode;
  cookies: string;
  queryNetworkMode: NetworkMode;
  queryApiUrl: string;
  querySubnet: string;
  apiUrls: Record<NetworkMode, string>;
}) {
  return (
    <CookiesProvider>
      <UIProvider cookies={cookies}>
        <Provider store={store}>
          <AppConfig
            queryNetworkMode={queryNetworkMode}
            queryApiUrl={queryApiUrl}
            querySubnet={querySubnet}
            apiUrls={apiUrls}
          >
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
          </AppConfig>
        </Provider>
      </UIProvider>
    </CookiesProvider>
  );
}
