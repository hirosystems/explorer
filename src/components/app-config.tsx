'use client';

import { useAppSelector } from '@/common/state/hooks';
import { NetworkMode } from '@/common/types/network';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

import { Connect } from '@stacks/connect-react';

import { selectUserSession } from '../app/sandbox/sandbox-slice';

declare const window: any;

export const AppConfig: React.FC<{
  apiUrls: any;
  queryNetworkMode: NetworkMode;
  queryApiUrl?: string;
  querySubnet?: string;
}> = ({ children, queryApiUrl, queryNetworkMode, querySubnet, apiUrls }) => {
  const { events } = useRouter();
  const userSession = useAppSelector(selectUserSession);

  const memoizedAnalyticsPage = useCallback((url: string) => {
    console.log('routeChangeComplete');
    window.analytics?.page(url);
  }, []);

  useEffect(() => {
    console.log('mount');
    if (!window.analytics) return;
    console.log('analytics');
    events.on('routeChangeComplete', memoizedAnalyticsPage);
    return () => {
      events.off('routeChangeComplete', memoizedAnalyticsPage);
    };
  }, [memoizedAnalyticsPage]);

  const memoizedToastMessage = useMemo(() => {
    return (
      <div>
        You're viewing {querySubnet ? 'a subnet' : `the \${queryNetworkMode}`}
        {querySubnet || queryApiUrl ? (
          <>
            <br />
            {querySubnet || queryApiUrl}
          </>
        ) : null}{' '}
        Explorer
      </div>
    );
  }, [querySubnet, queryApiUrl, queryNetworkMode]);

  useEffect(() => {
    toast(memoizedToastMessage, {
      style: {
        textAlign: 'center',
      },
    });
  }, [memoizedToastMessage]);

  const memoizedAppDetails = useMemo(() => {
    return {
      name: 'Stacks Explorer',
      icon: '/stx-circle.png',
    };
  }, []);

  return (
    <Connect
      authOptions={{
        appDetails: memoizedAppDetails,
        userSession,
      }}
    >
      <CacheProvider value={cache}>{children}</CacheProvider>
    </Connect>
  );
};
