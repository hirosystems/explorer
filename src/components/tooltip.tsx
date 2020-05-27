import * as React from 'react';
import { Tooltip as TooltipBase, TooltipProps } from '@blockstack/ui';

export const Tooltip = (props: TooltipProps) => (
  <TooltipBase
    display={['none', 'none', 'block']}
    maxWidth="unset"
    color="var(--colors-bg)"
    bg="var(--colors-invert)"
    placement="auto-start"
    hideDelay={500}
    {...props}
  />
);
