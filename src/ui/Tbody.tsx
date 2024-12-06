'use client';

import { TableBody as CUITbody, TableBodyProps as CUITbodyProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type TbodyProps = CUITbodyProps & UIComponent;
export const Tbody = forwardRef<HTMLTableSectionElement, TbodyProps>(
  ({ children, size, ...rest }, ref) => (
    <CUITbody
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUITbody>
  )
);
