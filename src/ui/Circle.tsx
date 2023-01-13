'use client';

import { Grid, GridProps } from '@/ui/components';
import { forwardRef, useColorMode } from '@chakra-ui/react';

export type CircleProps = GridProps;
export const Circle = forwardRef<GridProps, 'div'>(
  ({ size = '48px', borderRadius = size, ...rest }, ref) => (
    <Grid
      ref={ref}
      placeItems="center"
      width={size}
      height={size}
      borderRadius={borderRadius}
      alignItems={'center'}
      justifyContent={'center'}
      boxShadow={'rgb(0 0 0 / 4%) 0px 1px 2px'}
      border={`1px solid var(--stacks-colors-border-${useColorMode().colorMode})`}
      {...rest}
    />
  )
);
