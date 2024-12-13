'use client';

import {
  MenuItemGroup as CUIItemMenuGroup,
  MenuItemGroupProps as CUIMenuItemGroupProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuGroupProps = CUIMenuItemGroupProps & UIComponent;
export const MenuItemGroup = forwardRef<HTMLDivElement, MenuGroupProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIItemMenuGroup
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIItemMenuGroup>
  )
);
