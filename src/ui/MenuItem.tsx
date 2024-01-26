'use client';

import {
  MenuItem as CUIMenuItem,
  MenuItemProps as CUIMenuItemProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuItemProps = CUIMenuItemProps & UIComponent;
export const MenuItem = forwardRef<MenuItemProps, 'button'>(({ children, size, ...rest }, ref) => (
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
));
