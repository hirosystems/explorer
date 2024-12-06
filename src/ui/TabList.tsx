'use client';

import { TabsList as CUITabsList, TabsListProps as CUITabsListProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TabsListProps = CUITabsListProps & UIComponent;
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITabsList
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITabsList>
  )
);
