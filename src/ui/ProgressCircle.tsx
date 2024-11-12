'use client';

import { ProgressCircleRoot as CUIProgressCircleRoot } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type ProgressCircleProps = CUICircularProgressProps & UIComponent;
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIProgressCircleRoot ref={ref} {...rest}>
      {children}
    </CUIProgressCircleRoot>
  )
);
