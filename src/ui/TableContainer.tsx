'use client';

import {
  TableContainer as CUITableContainer,
  TableContainerProps as CUITableContainerProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type TableContainerProps = CUITableContainerProps & UIComponent;
export const TableContainer = forwardRef<TableContainerProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUITableContainer
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITableContainer>
  )
);
