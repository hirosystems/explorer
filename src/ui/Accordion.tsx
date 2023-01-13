'use client';

import {
  Accordion as CUIAccordion,
  AccordionProps as CUIAccordionProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AccordionProps = CUIAccordionProps & UIComponent;
export const Accordion = forwardRef<AccordionProps, 'div'>(({ children, size, ...rest }, ref) => (
  <CUIAccordion
    ref={ref}
    width={size || rest.width}
    height={size || rest.height}
    minWidth={size || rest.minWidth}
    minHeight={size || rest.minHeight}
    {...rest}
  >
    {children}
  </CUIAccordion>
));
