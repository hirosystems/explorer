'use client';

import {
  TableFooter as CUITableFooter,
  TableFooterProps as CUITableFooterProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TfootProps = CUITableFooterProps & UIComponent;
export const Tfoot = forwardRef<HTMLTableSectionElement, TfootProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITableFooter
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITableFooter>
  )
);
