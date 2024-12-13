'use client';

import { TableCell as CUITableCell, TableCellProps as CUITableCellProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TdProps = CUITableCellProps & UIComponent;
export const Td = forwardRef<HTMLTableCellElement, TdProps>(({ children, size, ...rest }, ref) => (
  <CUITableCell
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITableCell>
));
