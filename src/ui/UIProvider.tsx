import { ChakraProvider, ChakraProviderProps, cookieStorageManagerSSR } from '@chakra-ui/react';
import { theme } from '@/ui/theme/theme';

export interface UIProviderProps extends ChakraProviderProps {
  cookies?: string;
}
export function UIProvider(props: UIProviderProps) {
  const { cookies = '', children } = props;
  const colorModeManager = cookieStorageManagerSSR(cookies);
  return (
    <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
}
