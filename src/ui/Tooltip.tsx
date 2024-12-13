'use client';

import { forwardRef } from 'react';

import {
  Tooltip as SnippetTooltip,
  TooltipProps as SnippetTooltipProps,
} from '../components/ui/tooltip';

export type TooltipProps = SnippetTooltipProps;
// Having two files named Tooltip and tooltip could cause issues with the build
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({ children, ...rest }, ref) => {
  return (
    <SnippetTooltip
      positioning={{ placement: 'top' }}
      showArrow
      openDelay={0}
      closeDelay={0}
      ref={ref}
      closeOnClick={false} // This is broken in chakra-ui
      {...rest}
    >
      {children}
    </SnippetTooltip>
  );
});
