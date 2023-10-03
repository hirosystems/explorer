import { forwardRef } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Box, BoxProps } from '@/ui/components';

export type SvgProps = FC<BoxProps>;

export const BaseSvg = forwardRef<BoxProps, 'svg'>(({ as = 'svg', ...rest }, ref) => (
  <Box
    as={as}
    width="44px"
    height="auto"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    ref={ref}
    {...rest}
  />
));
