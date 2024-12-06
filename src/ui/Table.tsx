'use client';

import { TableRoot as CUITable, TableRootProps as CUITableProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TableProps = CUITableProps & UIComponent;
export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITable
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITable>
  )
);
