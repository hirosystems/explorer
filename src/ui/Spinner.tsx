'use client';

import { Spinner as CUISpinner, SpinnerProps as CUISpinnerProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type SpinnerProps = CUISpinnerProps & UIComponent;
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ children, size, ...rest }, ref) => (
    <CUISpinner ref={ref} {...rest}>
      {children}
    </CUISpinner>
  )
);
