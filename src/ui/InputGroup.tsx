'use client';

import { forwardRef } from 'react';

import {
  InputGroup as CUIInputGroup,
  InputGroupProps as CUIInputGroupProps,
} from '../components/ui/input-group';
import { UIComponent } from './types';

export type InputGroupProps = CUIInputGroupProps & UIComponent;
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIInputGroup
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIInputGroup>
  )
);
