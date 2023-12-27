'use client';

import {
  Heading as CUIHeading,
  HeadingProps as CUIHeadingProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type HeadingProps = CUIHeadingProps & UIComponent;
export const Heading = forwardRef<HeadingProps, 'h2'>(({ children, size, ...rest }, ref) => (
  <CUIHeading ref={ref} {...rest}>
    {children}
  </CUIHeading>
));
