import React from 'react';
import { RecoilRoot } from 'recoil';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { NetworkMode } from '@common/types/network';

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
