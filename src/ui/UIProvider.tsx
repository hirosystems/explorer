'use client';

import { ColorModeProviderProps } from '@/components/ui/color-mode';
import { Provider } from '@/components/ui/provider';

// export interface UIProviderProps extends ChakraProviderProps {
//   cookies?: string;
// }
export function UIProvider({
  children,
  colorModeProps,
}: {
  children: React.ReactNode;
  colorModeProps: ColorModeProviderProps;
}) {
  // const { cookies = '', children } = props;
  // const colorModeManager = cookieStorageManagerSSR(cookies);
  return (
    //   <CacheProvider>
    //   <ChakraProvider colorModeManager={colorModeManager} theme={theme}>
    // </CacheProvider>
    <Provider {...colorModeProps}>{children}</Provider>
  );
}
