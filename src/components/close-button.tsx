import React from 'react';
import { Box, BoxProps, CloseIcon } from '@blockstack/ui';

export const CloseButton = (props: BoxProps) => (
  <Box
    opacity={0.3}
    _hover={{ opacity: 1, cursor: 'pointer' }}
    color="var(--colors-invert)"
    size="12px"
    {...props}
  >
    <CloseIcon />
  </Box>
);
