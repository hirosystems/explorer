import { theme } from '@/ui/theme/theme';
import { ChakraProvider, ChakraProviderProps, cookieStorageManagerSSR } from '@chakra-ui/react';
import { FC } from 'react';

export interface UIProviderProps extends ChakraProviderProps {
  cookies?: string;
}
export const UIProvider: FC<UIProviderProps> = props => {
  const { cookies = '', children } = props;
  const colorModeManager = cookieStorageManagerSSR(cookies);
  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};
