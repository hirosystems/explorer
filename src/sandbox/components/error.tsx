import React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const Error: React.FC<BoxProps> = props => {
  return (
    <Box
      borderRadius="6px"
      bg="rgba(207,0,0,0.05)"
      border="1px solid rgba(207,0,0,0.1)"
      px="base"
      py="tight"
      color="red"
      lineHeight="1.8"
      fontSize="14px"
      wordBreak="break-all"
      {...props}
    />
  );
};
