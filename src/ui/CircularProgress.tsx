'use client';

import {
  CircularProgress as CUICircularProgress,
  CircularProgressProps as CUICircularProgressProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type CircularProgressProps = CUICircularProgressProps & UIComponent;
export const CircularProgress = forwardRef<CircularProgressProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUICircularProgress ref={ref} {...rest}>
      {children}
    </CUICircularProgress>
  )
);
