'use client';

import {
  HStack as CUIHStack,
  StackProps as CUIHStackProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type HStackProps = CUIHStackProps & UIComponent;
export const HStack = forwardRef<CUIHStackProps, 'div'>((props, ref) => (
  <CUIHStack ref={ref} {...props} />
));
