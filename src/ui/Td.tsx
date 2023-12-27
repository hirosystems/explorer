'use client';

import {
  Td as CUITd,
  TableCellProps as CUITdProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TdProps = CUITdProps & UIComponent;
export const Td = forwardRef<TdProps, 'td'>(({ children, size, ...rest }, ref) => (
  <CUITd
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUITd>
));
