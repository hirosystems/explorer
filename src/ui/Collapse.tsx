'use client';

import {
  Collapse as CUICollapse,
  CollapseProps as CUICollapseProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type CollapseProps = CUICollapseProps & UIComponent;
export const Collapse = forwardRef<CollapseProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUICollapse ref={ref} {...rest}>
    {children}
  </CUICollapse>
));
