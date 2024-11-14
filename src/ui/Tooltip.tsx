'use client';

import {
  TooltipRoot as CUITooltip,
  TooltipArrowProps as CUITooltipArrowProps,
  TooltipRootProps as CUITooltipProps,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export type TooltipProps = CUITooltipProps;
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps & CUITooltipArrowProps>(
  ({ children, ...rest }, ref) => (
    <CUITooltip
      positioning={{ placement: 'top' }}
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
  )
);
