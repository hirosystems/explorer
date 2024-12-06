'use client';

import {
  TabsContent as CUITabsContent,
  TabsContentProps as CUITabsContentProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TabPanelProps = CUITabsContentProps & UIComponent;
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITabsContent
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      p={'0'}
      {...rest}
    >
      {children}
    </CUITabsContent>
  )
);
