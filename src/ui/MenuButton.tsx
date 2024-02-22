'use client';

import {
  MenuButton as CUIMenuButton,
  MenuButtonProps as CUIMenuButtonProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import { UIComponent } from './types';

export type MenuButtonProps = CUIMenuButtonProps &
  UIComponent & {
    leftIcon?: ReactNode | null;
  };
export const MenuButton = forwardRef<MenuButtonProps, 'button'>(
  ({ children, size, ...rest }, ref) => (
    <CUIMenuButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIMenuButton>
  )
);
