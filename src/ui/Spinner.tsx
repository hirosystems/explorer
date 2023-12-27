'use client';

import {
  Spinner as CUISpinner,
  SpinnerProps as CUISpinnerProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type SpinnerProps = CUISpinnerProps & UIComponent;
export const Spinner = forwardRef<SpinnerProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUISpinner ref={ref} {...rest}>
    {children}
  </CUISpinner>
));
