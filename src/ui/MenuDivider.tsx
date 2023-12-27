'use client';

import {
  MenuDivider as CUIMenuDivider,
  MenuDividerProps as CUIMenuDividerProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuDividerProps = CUIMenuDividerProps & UIComponent;
export const MenuDivider = forwardRef<MenuDividerProps, 'hr'>(
  ({ children, size, ...rest }, ref) => <CUIMenuDivider {...rest}>{children}</CUIMenuDivider>
);
