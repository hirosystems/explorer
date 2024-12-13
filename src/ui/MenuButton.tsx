'use client';

import {
  MenuTrigger as CUIMenuButton,
  MenuTriggerProps as CUIMenuButtonProps,
} from '@chakra-ui/react';
import { ReactNode, forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuButtonProps = CUIMenuButtonProps &
  UIComponent & {
    leftIcon?: ReactNode | null;
  };
export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
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
