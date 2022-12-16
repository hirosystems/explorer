import React from 'react';

import { Box, BoxProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export type SvgProps = React.FC<BoxProps>;

export const BaseSvg: ForwardRefExoticComponentWithAs<BoxProps, 'svg'> = forwardRefWithAs<
  BoxProps,
  'svg'
>(({ as = 'svg', ...props }, ref) => (
  <Box
    as={as}
    width="44px"
    height="auto"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    ref={ref}
    {...props}
  />
));
