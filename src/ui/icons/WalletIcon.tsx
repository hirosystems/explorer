'use client';

import { forwardRef } from '@chakra-ui/react';
import React from 'react';
import { IconBaseProps } from 'react-icons';

import { Box } from '../Box';

export const WalletIcon = forwardRef<IconBaseProps, 'svg'>(({ size = '44px' }, ref) => (
  <Box
    as={'svg'}
    viewBox="0 0 24 24"
    strokeWidth="1"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    size={size}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
  </Box>
));
