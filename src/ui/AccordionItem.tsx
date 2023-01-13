'use client';

import {
  AccordionItem as CUIAccordionItem,
  AccordionItemProps as CUIAccordionItemProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AccordionItemProps = CUIAccordionItemProps & UIComponent;
export const AccordionItem = forwardRef<AccordionItemProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIAccordionItem
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAccordionItem>
  )
);
