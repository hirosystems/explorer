'use client';

import { Box } from '@/ui/components';
import { forwardRef } from '@chakra-ui/react';
import React from 'react';
import { IconBaseProps } from 'react-icons';

export const CoinbaseIcon = forwardRef<IconBaseProps, 'svg'>(
  ({ color = 'currentColor', strokeWidth = '1.5', size, ...props }, ref) => (
    <Box
      display="block"
      as={'svg'}
      height="auto"
      viewBox="0 0 16 16"
      fill="none"
      ref={ref}
      color={color}
      size={size}
    >
      <path
        d="M8.01505 3.99954C5.80086 3.99954 4.00798 5.78996 4.00798 8C4.00798 10.21 5.80177 11.9995 8.01505 11.9995C9.99852 11.9995 11.6455 10.5559 11.9628 8.66629H16C15.6589 12.7732 12.2164 16 8.01505 16C3.59031 16 0 12.4164 0 8C0 3.58357 3.59031 0 8.01505 0C12.2164 0 15.6598 3.22676 16 7.33371H11.9592C11.6418 5.44317 9.99852 3.99954 8.01505 3.99954Z"
        fill="#8D929A"
      />
    </Box>
  )
);
