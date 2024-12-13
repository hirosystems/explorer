'use client';

import {
  TableHeader as CUITableHeader,
  TableHeaderProps as CUITableHeaderProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TheadProps = CUITableHeaderProps & UIComponent;
export const Thead = forwardRef<HTMLTableSectionElement, TheadProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITableHeader
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITableHeader>
  )
);
