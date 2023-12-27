'use client';

import {
  Stack as CUIStack,
  StackProps as CUIStackProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type StackProps = CUIStackProps & UIComponent;
export const Stack = forwardRef<CUIStackProps, 'div'>((props, ref) => (
  <CUIStack ref={ref} {...props} />
));
