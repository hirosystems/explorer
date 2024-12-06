'use client';

import {
  ProgressCircleValueText as CUIProgressCircleValueText,
  ProgressCircleValueTextProps as CUIProgressCircleValueTextProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type CircularProgressLabelProps = CUIProgressCircleValueTextProps & UIComponent;
export const ProgressCircleValueText = forwardRef<HTMLDivElement, CircularProgressLabelProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIProgressCircleValueText ref={ref} {...rest}>
      {children}
    </CUIProgressCircleValueText>
  )
);
