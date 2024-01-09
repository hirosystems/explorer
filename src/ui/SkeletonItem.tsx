'use client';

import {
  Skeleton as CUISkeleton,
  SkeletonProps as CUISkeletonProps,
  LightMode,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type SkeletonProps = CUISkeletonProps & UIComponent;
export const SkeletonItem = forwardRef<SkeletonProps, 'div'>(({ children, size, ...rest }, ref) => (
  <LightMode>
    <CUISkeleton ref={ref} {...rest}>
      {children}
    </CUISkeleton>
  </LightMode>
));
