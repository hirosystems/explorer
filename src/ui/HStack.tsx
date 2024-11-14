'use client';

import { HStack as CUIHStack, StackProps as CUIHStackProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type HStackProps = CUIHStackProps & UIComponent;
export const HStack = forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <CUIHStack ref={ref} {...props} />
));
