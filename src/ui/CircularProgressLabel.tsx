'use client';

import {
  CircularProgressLabel as CUICircularProgressLabel,
  CircularProgressLabelProps as CUICircularProgressLabelProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type CircularProgressLabelProps = CUICircularProgressLabelProps & UIComponent;
export const CircularProgressLabel = forwardRef<CircularProgressLabelProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUICircularProgressLabel ref={ref} {...rest}>
      {children}
    </CUICircularProgressLabel>
  )
);
