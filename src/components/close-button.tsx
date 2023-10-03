import React from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Box, BoxProps } from '@/ui/components';

export const CloseButton = (props: BoxProps & { onClick?: any }) => (
  <Box
    opacity={0.3}
    _hover={{ opacity: 1, cursor: 'pointer' }}
    color="var(--colors-invert)"
    size="12px"
    {...props}
  >
    <RiCloseLine />
  </Box>
);
