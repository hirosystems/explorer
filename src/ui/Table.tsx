import {
  forwardRef,
  Table as CUITable,
  TableProps as CUITableProps,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TableProps = CUITableProps & UIComponent;
export const Table = forwardRef<TableProps, 'table'>(({ children, size, ...rest }, ref) => (
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
