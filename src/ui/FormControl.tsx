'use client';

import {
  FormControl as CUIFormControl,
  FormControlProps as CUIFormControlProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type FormControlProps = CUIFormControlProps & UIComponent;
export const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIFormControl
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIFormControl>
  )
);
