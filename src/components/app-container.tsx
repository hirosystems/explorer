import React from 'react';

import { NetworkMode } from '@common/types/network';

import { AppWrapper } from '@components/app-init';

interface AppContainerProps {
  networkMode?: NetworkMode;
}

export const AppContainer: React.FC<AppContainerProps> = props => {
  const { children, ...rest } = props;
  return <AppWrapper {...rest}>{children}</AppWrapper>;
};
