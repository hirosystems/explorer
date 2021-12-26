import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { NetworkMode } from '@common/types/network';

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

  return (
    <RecoilRoot>
      <CacheProvider value={cache}>
        <AppContainer networkMode={networkMode} isHome={isHome} fullWidth={fullWidth}>
          {children}
        </AppContainer>
      </CacheProvider>
    </RecoilRoot>
  );
};
