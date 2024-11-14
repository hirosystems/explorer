'use client';

import { Stack as CUIStack, StackProps as CUIStackProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type StackProps = CUIStackProps & UIComponent;
export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => (
  <CUIStack ref={ref} {...props} />
));
