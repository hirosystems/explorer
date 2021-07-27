import React from 'react';
import { AppWrapper } from '@components/app-init';
import { useFathom } from '@common/hooks/use-fathom';
import { NetworkMode } from '@common/types/network';

interface AppContainerProps {
  isHome?: boolean;
  fullWidth?: boolean;
  networkMode?: NetworkMode;
}

export const AppContainer: React.FC<AppContainerProps> = props => {
  const { children, networkMode, ...rest } = props;
  useFathom();
  return <AppWrapper {...rest}>{children}</AppWrapper>;
};
