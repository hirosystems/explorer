'use client';

import {
  Tooltip as CUITooltip,
  TooltipProps as CUITooltipProps,
  forwardRef,
} from '@chakra-ui/react';

export type TooltipProps = CUITooltipProps;
export const Tooltip = forwardRef<TooltipProps, 'div'>(({ children, ...rest }, ref) => (
  <CUITooltip
    placement="top"
    hasArrow
    arrowSize={10}
    p={2}
    borderRadius={'md'}
    bg={'invert'}
    ref={ref}
    closeOnClick={false}
    {...rest}
  >
    {children}
  </CUITooltip>
));
