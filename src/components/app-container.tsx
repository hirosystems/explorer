import React, { memo } from 'react';
import { AppWrapper } from '@components/app-init';
import { CacheProvider } from '@emotion/react';
import { cache } from '@emotion/css';
import { useChainModeEffect } from '@common/hooks/use-chain-mode';
import { useFathom } from '@common/hooks/use-fathom';

interface AppContainerProps {
  isHome?: boolean;
}

export const AppContainer: React.FC<AppContainerProps> = memo(props => {
  const { children, isHome } = props;

  useChainModeEffect();
  useFathom();

  return (
    <CacheProvider value={cache}>
      <AppWrapper isHome={isHome}>{children}</AppWrapper>
    </CacheProvider>
  );
});
