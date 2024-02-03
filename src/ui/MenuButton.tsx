'use client';

import {
  MenuButton as CUIMenuButton,
  MenuButtonProps as CUIMenuButtonProps,
  forwardRef,
  useColorModeValue,
} from '@chakra-ui/react';

import { UIComponent } from './types';
import { ReactNode } from 'react';

export type MenuButtonProps = CUIMenuButtonProps &
  UIComponent & {
    leftIcon?: ReactNode | null;
  };
export const MenuButton = forwardRef<MenuButtonProps, 'button'>(
  ({ children, size, ...rest }, ref) => {
    const hoverBg = useColorModeValue('slate.150 !important', 'slate.900');

    return (
      <CUIMenuButton
        _hover={{ bg: hoverBg }}
        _active={{ bg: hoverBg }}
        ref={ref}
        width={size || rest.width}
        height={size || rest.height}
        minWidth={size || rest.minWidth}
        minHeight={size || rest.minHeight}
        {...rest}
      >
        {children}
      </CUIMenuButton>
    );
  }
);
