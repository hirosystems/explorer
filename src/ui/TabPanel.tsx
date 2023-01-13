'use client';

import {
  TabPanel as CUITabPanel,
  TabPanelProps as CUITabPanelProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TabPanelProps = CUITabPanelProps & UIComponent;
export const TabPanel = forwardRef<TabPanelProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITabPanel
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    p={'0'}
    {...rest}
  >
    {children}
  </CUITabPanel>
));
