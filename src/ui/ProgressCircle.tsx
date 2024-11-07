'use client';

import {
  ProgressCircleRoot as CUIProgressCircleRoot,
  ProgressCircleRootProps as CUIProgressCircleRootProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type ProgressCircleProps = CUIProgressCircleRootProps & UIComponent;
export const ProgressCircle = forwardRef<HTMLDivElement, ProgressCircleProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIProgressCircleRoot ref={ref} {...rest}>
      {children}
    </CUIProgressCircleRoot>
  )
);
