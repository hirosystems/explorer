import React from 'react';
import { SVGProps } from 'react';

import { Box, BoxProps } from '@stacks/ui';

export const PaletteIcon: React.FC<BoxProps> = props => (
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
    <path d="M12 21a9 9 0 1 1 0 -18a9 8 0 0 1 9 8a4.5 4 0 0 1 -4.5 4h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
    <circle cx="7.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="12" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="16.5" cy="10.5" r=".5" fill="currentColor" />
  </Box>
);
