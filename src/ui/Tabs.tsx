import {
  forwardRef,
  Tabs as CUITabs,
  TabsProps as CUITabsProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabsProps = CUITabsProps & UIComponent;
export const Tabs = forwardRef<TabsProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITabs
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderRadius="12px"
    border={`1px solid var(--stacks-colors-border-${useColorMode().colorMode})`}
    bg={`bg.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUITabs>
));
