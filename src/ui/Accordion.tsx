'use client';

import { Accordion as CUIAccordion } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AccordionProps = CUIAccordion.RootProps & UIComponent;
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIAccordion.Root
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAccordion.Root>
  )
);
