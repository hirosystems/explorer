import { forwardRef, Menu as CUIMenu, MenuProps as CUIMenuProps } from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuProps = CUIMenuProps & UIComponent;
export const Menu = forwardRef<MenuProps, 'div'>(({ children, ...rest }, ref) => (
  <CUIMenu {...rest}>{children}</CUIMenu>
));
