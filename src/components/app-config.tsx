import React from 'react';
import { RecoilRoot } from 'recoil';
import Router from 'next/router';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { NetworkMode } from '@common/types/network';

declare const window: any;

// Track client-side page views with Segment
Router.events.on('routeChangeComplete', url => {
  window.analytics.page(url);
});

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
}) => (
  <RecoilRoot>
    <CacheProvider value={cache}>
      <AppContainer networkMode={networkMode} isHome={isHome} fullWidth={fullWidth}>
        {children}
      </AppContainer>
    </CacheProvider>
  </RecoilRoot>
);
