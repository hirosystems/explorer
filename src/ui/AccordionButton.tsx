'use client';

import {
  AccordionButton as CUIAccordionButton,
  AccordionButtonProps as CUIAccordionButtonProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AccordionButtonProps = CUIAccordionButtonProps & UIComponent;
export const AccordionButton = forwardRef<AccordionButtonProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIAccordionButton
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAccordionButton>
  )
);
