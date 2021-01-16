import React, { memo } from 'react';
import { RecoilRoot } from 'recoil';
import { SWRConfig } from 'swr';
import { AppContainer } from '@components/app-container';

import { DEFAULT_POLLING_INTERVAL } from '@common/constants';

interface AppConfigProps {
  isHome?: boolean;
}

export const AppConfig: React.FC<AppConfigProps> = memo(({ children, isHome }) => (
  <SWRConfig
    value={{
      refreshInterval: DEFAULT_POLLING_INTERVAL,
      suspense: false,
    }}
  >
    <RecoilRoot>
      <AppContainer isHome={isHome}>{children}</AppContainer>
    </RecoilRoot>
  </SWRConfig>
));
