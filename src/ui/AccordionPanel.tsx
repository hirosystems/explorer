'use client';

import {
  AccordionPanel as CUIAccordionPanel,
  AccordionPanelProps as CUIAccordionPanelProps,
  forwardRef,
  useColorMode,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AccordionPanelProps = CUIAccordionPanelProps & UIComponent;
export const AccordionPanel = forwardRef<AccordionPanelProps, 'div'>(
  ({ children, size, ...rest }, ref) => (
    <CUIAccordionPanel
      ref={ref}
      width={size || rest.width}
      height={size || rest.height}
      minWidth={size || rest.minWidth}
      minHeight={size || rest.minHeight}
      {...rest}
    >
      {children}
    </CUIAccordionPanel>
  )
);
