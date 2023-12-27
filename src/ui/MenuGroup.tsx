'use client';

import {
  MenuGroup as CUIMenuGroup,
  MenuGroupProps as CUIMenuGroupProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuGroupProps = CUIMenuGroupProps & UIComponent;
export const MenuGroup = forwardRef<MenuGroupProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIMenuGroup
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIMenuGroup>
));
