import React from 'react';
import { AppWrapper } from '@components/app-init';
import { NetworkMode } from '@common/types/network';

interface AppContainerProps {
  networkMode?: NetworkMode;
}

export const AppContainer: React.FC<AppContainerProps> = props => {
  const { children, ...rest } = props;
  return <AppWrapper {...rest}>{children}</AppWrapper>;
};
