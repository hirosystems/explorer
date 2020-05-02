import * as React from 'react';
import { Tooltip as TooltipBase, TooltipProps } from '@blockstack/ui';

export const Tooltip = (props: TooltipProps) => (
  <TooltipBase
    maxWidth="unset"
    color="var(--colors-bg)"
    bg="var(--colors-invert)"
    hasArrow
    placement="auto-start"
    hideDelay={500}
    {...props}
  />
);
