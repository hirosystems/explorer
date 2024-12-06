'use client';

import { MenuItem as CUIMenuItem, MenuItemProps as CUIMenuItemProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuItemProps = CUIMenuItemProps & UIComponent;
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIMenuItem
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIMenuItem>
  )
);
