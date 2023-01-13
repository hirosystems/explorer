'use client';

import {
  TabPanels as CUITabPanels,
  TabPanelsProps as CUITabPanelsProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabPanelsProps = CUITabPanelsProps & UIComponent;
export const TabPanels = forwardRef<TabPanelsProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITabPanels
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITabPanels>
));
