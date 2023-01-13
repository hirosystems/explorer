'use client';

import {
  FormControl as CUIFormControl,
  FormControlProps as CUIFormControlProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type FormControlProps = CUIFormControlProps & UIComponent;
export const FormControl = forwardRef<FormControlProps, 'div'>(
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
