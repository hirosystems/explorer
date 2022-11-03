import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { NetworkMode } from '@common/types/network';
import { Connect } from '@stacks/connect-react';
import { useAppSelector } from '@common/state/hooks';
import { selectUserSession } from '@modules/sandbox/sandbox-slice';

// TODO: Replace any type w/ SegmentAnalytics
// import { SegmentAnalytics } from '@segment/analytics.js-core';
declare const window: any;

interface AppConfigProps {
  isHome?: boolean;
  fullWidth?: boolean;
  networkMode?: NetworkMode;
}

export const AppConfig: React.FC<AppConfigProps> = ({
  children,
  networkMode,
  isHome,
  fullWidth,
}) => {
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
        <AppContainer networkMode={networkMode} isHome={isHome} fullWidth={fullWidth}>
          {children}
        </AppContainer>
      </CacheProvider>
    </Connect>
  );
};
