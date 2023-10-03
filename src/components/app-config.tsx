import { cache } from '@emotion/css';
import { CacheProvider } from '@emotion/react';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Connect } from '@stacks/connect-react';
import { NetworkMode } from '@/common/types/network';
import { useAppSelector } from '@/common/state/hooks';

import { selectUserSession } from '../appPages/sandbox/sandbox-slice';

declare const window: any;

export function AppConfig({
  children,
  queryApiUrl,
  queryNetworkMode,
  querySubnet,
  apiUrls,
}: {
  apiUrls: any;
  queryNetworkMode: NetworkMode;
  queryApiUrl?: string;
  querySubnet?: string;
  children?: ReactNode;
}) {
  const { events } = useRouter();
  const userSession = useAppSelector(selectUserSession);

  useEffect(() => {
    if (!window.analytics) return;
    events.on('routeChangeComplete', (url: string) => {
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
}
