'use client';

import {
  CollapsibleRoot as CUICollapsibleRoot,
  CollapsibleRootProps as CUICollapsibleRootProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type CollapsibleProps = CUICollapsibleRootProps & UIComponent;
export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ children, size, ...rest }, ref) => (
    <CUICollapsibleRoot ref={ref} {...rest}>
      {children}
    </CUICollapsibleRoot>
  )
);
