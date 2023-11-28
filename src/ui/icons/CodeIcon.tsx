'use client';

import { forwardRef } from '@chakra-ui/react';
import React from 'react';
import { IconBaseProps } from 'react-icons';

import { Box } from '../Box';

export const CodeIcon = forwardRef<IconBaseProps, 'svg'>(({ size = '44px' }, ref) => (
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
    <path stroke="none" d="M0 0h24v24H0z" />
    <polyline points="7 8 3 12 7 16" />
    <polyline points="17 8 21 12 17 16" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </Box>
));
