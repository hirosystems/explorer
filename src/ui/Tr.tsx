'use client';

import { TableRow as CUITableRow, TableRowProps as CUITableRowProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TrProps = CUITableRowProps & UIComponent;
export const Tr = forwardRef<HTMLTableRowElement, TrProps>(({ children, size, ...rest }, ref) => (
  <CUITableRow
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITableRow>
));
