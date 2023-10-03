import {
  forwardRef,
  MenuDivider as CUIMenuDivider,
  MenuDividerProps as CUIMenuDividerProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuDividerProps = CUIMenuDividerProps & UIComponent;
export const MenuDivider = forwardRef<MenuDividerProps, 'hr'>(
  ({ children, size, ...rest }, ref) => (
    <CUIMenuDivider borderColor={`border.${useColorMode().colorMode}`} {...rest}>
      {children}
    </CUIMenuDivider>
  )
);
