'use client';

import {
  MenuContent as CUIMenuContent,
  MenuContentProps as CUIMenuContentProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type MenuListProps = CUIMenuContentProps & UIComponent;
export const MenuList = forwardRef<HTMLDivElement, MenuListProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIMenuContent
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      css={{ '& > *:not(:last-child)': { mb: 2 } }}
      {...rest}
    >
      {children}
    </CUIMenuContent>
  )
);
