'use client';

import { Accordion as CUIAccordion } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AccordionItemTriggerProps = CUIAccordion.ItemTriggerProps & UIComponent;
export const AccordionItemTrigger = forwardRef<HTMLButtonElement, AccordionItemTriggerProps>(
  function AccordionItemTrigger({ children, size, ...rest }, ref) {
    return (
      <CUIAccordion.ItemTrigger
        ref={ref}
        width={size || rest.width}
        height={size || rest.height}
        minWidth={size || rest.minWidth}
        minHeight={size || rest.minHeight}
        {...rest}
      >
        {children}
      </CUIAccordion.ItemTrigger>
    );
  }
);
