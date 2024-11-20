'use client';

import { Skeleton as CUISkeleton, SkeletonProps as CUISkeletonProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type SkeletonProps = CUISkeletonProps & UIComponent;
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ children, size, ...rest }, ref) => (
    <CUISkeleton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUISkeleton>
  )
);
