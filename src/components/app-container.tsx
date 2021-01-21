import React from 'react';
import { AppWrapper } from '@components/app-init';
import { useChainModeEffect } from '@common/hooks/use-chain-mode';

interface AppContainerProps {
  isHome?: boolean;
}

export const AppContainer: React.FC<AppContainerProps> = props => {
  const { children, isHome } = props;
  useChainModeEffect();
  return <AppWrapper isHome={isHome}>{children}</AppWrapper>;
};
