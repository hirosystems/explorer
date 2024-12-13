'use client';

import {
  MenuSeparator as CUIMenuSeparator,
  MenuSeparatorProps as CUIMenuSeparatorProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuSeparatorProps = CUIMenuSeparatorProps & UIComponent;
export const MenuSeparator = forwardRef<HTMLHRElement, MenuSeparatorProps>(
  ({ children, size, ...rest }, ref) => <CUIMenuSeparator {...rest}>{children}</CUIMenuSeparator>
);
