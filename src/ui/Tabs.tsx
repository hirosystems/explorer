'use client';

import { TabsRoot as CUITabs, TabsRootProps as CUITabsProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TabsProps = CUITabsProps & UIComponent;
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(({ children, size, ...rest }, ref) => (
  <CUITabs
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
