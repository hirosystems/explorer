import { Box, BoxProps } from '@stacks/ui';

import React from 'react';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const StxInline: ForwardRefExoticComponentWithAs<BoxProps, 'svg'> = forwardRefWithAs<
  BoxProps,
  'svg'
>(({ color = 'black', as = 'svg', strokeWidth = '1.5', ...props }, ref) => (
  <Box
    display="block"
    as={as}
    height="auto"
    viewBox="0 0 22 22"
    fill="none"
    ref={ref}
    color={color}
    transform="translate(0, 0)"
    {...props}
  >
    <path
      d="M4.18817 0.940674L9.37024 8.99389M9.37024 8.99389H0.266602M9.37024 8.99389H12.7316"
      stroke="currentColor"
      strokeWidth={strokeWidth as any}
      strokeLinejoin="bevel"
    />
    <path
      d="M17.9129 0.940674L12.7308 8.99389H21.8345"
      stroke="currentColor"
      strokeWidth={strokeWidth as any}
      strokeLinejoin="bevel"
    />
    <path
      d="M4.18817 21.4407L9.37024 13.3875M9.37024 13.3875H0.266602M9.37024 13.3875H12.7316"
      stroke="currentColor"
      strokeWidth={strokeWidth as any}
      strokeLinejoin="bevel"
    />
    <path
      d="M17.9129 21.4407L12.7308 13.3875H21.8345"
      stroke="currentColor"
      strokeWidth={strokeWidth as any}
      strokeLinejoin="bevel"
    />
  </Box>
));
