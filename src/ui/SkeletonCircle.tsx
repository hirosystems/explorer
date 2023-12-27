'use client';

import {
  SkeletonCircle as CUISkeletonCircle,
  SkeletonProps as CUISkeletonCircleProps,
  LightMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type SkeletonCircleProps = CUISkeletonCircleProps & UIComponent;
export const SkeletonCircle = (props: SkeletonCircleProps) => (
  <LightMode>
    <CUISkeletonCircle {...props} />
  </LightMode>
);
