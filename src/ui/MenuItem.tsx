'use client';

import {
  MenuItem as CUIMenuItem,
  MenuItemProps as CUIMenuItemProps,
  forwardRef,
  useColorModeValue,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuItemProps = CUIMenuItemProps & UIComponent;
export const MenuItem = forwardRef<MenuItemProps, 'button'>(({ children, size, ...rest }, ref) => {
  const blackColor = useColorModeValue('slate.900', 'slate.900');
  const hoverBg = useColorModeValue('slate.150 !important', 'slate.900');

  return (
    <CUIMenuItem
      padding="12px 16px"
      borderRadius="10px"
      color={blackColor}
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
    </CUIMenuItem>
  );
});
