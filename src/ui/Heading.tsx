'use client';

import { Heading as CUIHeading, HeadingProps as CUIHeadingProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type HeadingProps = CUIHeadingProps & UIComponent;
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIHeading ref={ref} {...rest}>
      {children}
    </CUIHeading>
  )
);
