'use client';

import {
  Table as CUITable,
  TableProps as CUITableProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TableProps = CUITableProps & UIComponent;
export const Table = forwardRef<TableProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUITable
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    borderColor={`border.${useColorMode().colorMode}`}
    {...rest}
  >
    {children}
  </CUITable>
));
