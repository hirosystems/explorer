'use client';

import { MenuRoot as CUIMenu, MenuRootProps as CUIMenuProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuProps = CUIMenuProps & UIComponent;
export const Menu = forwardRef<HTMLDivElement, MenuProps>(({ children, ...rest }, ref) => (
  <CUIMenu {...rest}>{children}</CUIMenu>
));
