'use client';

import { useAppSelector } from '@/common/state/hooks';
import { NetworkMode } from '@/common/types/network';
import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    console.log('mount');
    if (!window.analytics) return;
    console.log('analytics');
    events.on('routeChangeComplete', (url: string) => {
      console.log('routeChangeComplete');
      return window.analytics?.page(url);
    });
  }, []);

  useEffect(() => {
    toast(
      <div>
        You're viewing {querySubnet ? 'a subnet' : `the ${queryNetworkMode}`}
        {querySubnet || queryApiUrl ? (
          <>
            <br />
            {querySubnet || queryApiUrl}
          </>
        ) : null}{' '}
        Explorer
      </div>,
      {
        style: {
          textAlign: 'center',
        },
      }
    );
  }, []);

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
      <CacheProvider value={cache}>{children}</CacheProvider>
    </Connect>
  );
};
