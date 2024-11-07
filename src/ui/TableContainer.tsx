'use client';

// source is from chakra v2. deprecated in chakra v3. TODO: remove
import { Box, BoxProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export const TableContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { children, overflow, overflowX, className, ...rest } = props;
  return (
    <Box
      ref={ref}
      className={`chakra-table__container ${className || ''}`}
      display="block"
      whiteSpace="nowrap"
      WebkitOverflowScrolling="touch"
      // @ts-ignore
      overflowX={overflow ?? overflowX ?? 'auto'}
      overflowY="hidden"
      maxWidth="100%"
      {...rest}
    >
      {children}
    </Box>
  );
});
