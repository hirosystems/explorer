import React from 'react';
import { SVGProps } from 'react';

import { Box, BoxProps } from '@stacks/ui';

export const AccessibleIcon: React.FC<BoxProps> = props => (
  <Box
    as="svg"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <path d="M10 16.5l2 -3l2 3m-2 -3v-2l3 -1m-6 0l3 1" />
    <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
  </Box>
);
