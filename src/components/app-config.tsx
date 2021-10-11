import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';
import { AppContainer } from '@components/app-container';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { NetworkMode } from '@common/types/network';
import { useAnalytics } from '@common/hooks/use-analytics';

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
  const analytics = useAnalytics();

  useEffect(() => {
    events.on('routeChangeComplete', (url: string) => analytics.page(url));
  }, []);

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
