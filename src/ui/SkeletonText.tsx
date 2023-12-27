'use client';

import {
  SkeletonText as CUISkeletonText,
  SkeletonTextProps as CUISkeletonTextProps,
  LightMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type SkeletonTextProps = CUISkeletonTextProps & UIComponent;
export const SkeletonText = (props: SkeletonTextProps) => (
  <LightMode>
    <CUISkeletonText {...props} />
  </LightMode>
);
