'use client';

import { Skeleton as CUISkeleton, SkeletonProps as CUISkeletonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type SkeletonProps = CUISkeletonProps & UIComponent;
export const SkeletonItem = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ children, size, ...rest }, ref) => (
    <CUISkeleton ref={ref} {...rest}>
      {children}
    </CUISkeleton>
  )
);
