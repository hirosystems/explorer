'use client';

import { Accordion as CUIAccordion } from '@chakra-ui/react';
import { forwardRef } from 'react';

import { UIComponent } from './types';

export type AccordionPanelProps = CUIAccordion.ItemBodyProps & UIComponent;
export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, size, ...rest }, ref) => (
    <CUIAccordion.ItemContent
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAccordion.ItemContent>
  )
);
