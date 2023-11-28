'use client';

import { forwardRef } from '@chakra-ui/react';

import { Box, BoxProps } from './Box';

export const ExclamationMarkCircleIcon = forwardRef<BoxProps, 'div'>((props, ref) => (
  <Box ref={ref} {...props}>
    <svg width="100%" viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7.9983 4C8.46541 4 8.84049 4.38536 8.82787 4.8523L8.72037 8.82986C8.70981 9.22031 8.39026 9.53134 7.99967 9.53134C7.60928 9.53134 7.28981 9.2206 7.279 8.83036L7.16874 4.85287C7.15579 4.38572 7.53096 4 7.9983 4ZM8.9199 11.0743C8.91607 11.5873 8.49058 12 7.99992 12C7.49392 12 7.0761 11.5873 7.07993 11.0743C7.0761 10.569 7.49392 10.1562 7.99992 10.1562C8.49058 10.1562 8.91607 10.569 8.9199 11.0743Z"
        fill="currentColor"
      />
    </svg>
  </Box>
));
