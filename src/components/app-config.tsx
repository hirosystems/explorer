import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Connect } from '@stacks/connect-react';

import { IS_SSR } from '@common/constants';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import { ApiUrls, initialize, selectIsInitialized } from '@common/state/network-slice';
import { NetworkMode } from '@common/types/network';

import { AppContainer } from '@components/app-container';

import { selectUserSession } from '@modules/sandbox/sandbox-slice';

declare const window: any;

interface AppConfigProps {
  apiUrls: ApiUrls;
  queryNetworkMode: NetworkMode;
  queryApiUrl?: string;
}

export const AppConfig: React.FC<AppConfigProps> = ({
  children,
  apiUrls,
  queryNetworkMode,
  queryApiUrl,
}) => {
  const { events } = useRouter();
  const dispatch = useAppDispatch();
  const userSession = useAppSelector(selectUserSession);
  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    console.log('mount');
    if (!window.analytics) return;
    console.log('analytics');
    events.on('routeChangeComplete', (url: string) => {
      console.log('routeChangeComplete');
      return window.analytics?.page(url);
    });
  }, []);

  if (!isInitialized) {
    dispatch(initialize({ apiUrls, queryNetworkMode, queryApiUrl }));
    return null;
  }

  if (IS_SSR) {
    return null;
  }

  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'Stacks Explorer',
          icon: '/stx-circle.png',
        },
        userSession,
      }}
    >
      <CacheProvider value={cache}>
        <AppContainer>{children}</AppContainer>
      </CacheProvider>
    </Connect>
  );
};
