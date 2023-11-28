'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ChakraProviderProps, cookieStorageManagerSSR } from '@chakra-ui/react';
import { FC } from 'react';

import { theme } from './theme/theme';

export interface UIProviderProps extends ChakraProviderProps {
  cookies?: string;
}
export const UIProvider: FC<UIProviderProps> = props => {
  const { cookies = '', children } = props;
  const colorModeManager = cookieStorageManagerSSR(cookies);
  return (
    <CacheProvider>
      <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
};
