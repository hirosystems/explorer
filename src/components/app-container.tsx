import React from 'react';
import { AppWrapper } from '@components/app-init';
import { useChainModeEffect } from '@common/hooks/use-chain-mode';
import { useFathom } from '@common/hooks/use-fathom';

interface AppContainerProps {
  isHome?: boolean;
  fullWidth?: boolean;
}

export const AppContainer: React.FC<AppContainerProps> = props => {
  const { children, ...rest } = props;
  useChainModeEffect();
  useFathom();
  return <AppWrapper {...rest}>{children}</AppWrapper>;
};
