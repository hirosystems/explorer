'use client';

import {
  Tabs as CUITabs,
  TabsProps as CUITabsProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabsProps = CUITabsProps & UIComponent;
export const Tabs = forwardRef<TabsProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITabs
    variant={'soft-rounded'}
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITabs>
));
