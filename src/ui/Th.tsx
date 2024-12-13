'use client';

import {
  TableColumnHeader as CUITableColumnHeader,
  TableColumnHeaderProps as CUITableColumnHeaderProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type ThProps = CUITableColumnHeaderProps & UIComponent;
export const Th = forwardRef<HTMLTableCellElement, ThProps>(({ children, size, ...rest }, ref) => (
  <CUITableColumnHeader
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITableColumnHeader>
));
