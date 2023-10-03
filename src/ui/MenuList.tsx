import {
  forwardRef,
  MenuList as CUIMenuList,
  MenuListProps as CUIMenuListProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type MenuListProps = CUIMenuListProps & UIComponent;
export const MenuList = forwardRef<MenuListProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIMenuList
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUIMenuList>
));
