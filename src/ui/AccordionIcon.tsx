'use client';

import {
  AccordionIcon as CUIAccordionIcon,
  IconProps as CUIAccordionIconProps,
  forwardRef,
} from '@chakra-ui/react';

import { UIComponent } from './types';

export type AccordionIconProps = CUIAccordionIconProps & UIComponent;
export const AccordionIcon = forwardRef<AccordionIconProps, 'svg'>(
  ({ children, size, ...rest }, ref) => (
    <span ref={ref}>
      <CUIAccordionIcon
        width={size || rest.width}
        height={size || rest.height}
        minWidth={size || rest.minWidth}
        minHeight={size || rest.minHeight}
        {...rest}
      >
        {children}
      </CUIAccordionIcon>
    </span>
  )
);
