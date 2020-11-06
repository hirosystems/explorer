import React from 'react';
import { stringToHslColor } from '@common/utils';
import { Grid, color, GridProps } from '@stacks/ui';

export const DynamicColorCircle: React.FC<{ string: string } & GridProps> = ({
  string,
  ...rest
}) => (
  <Grid
    borderRadius="100%"
    mr="base"
    size="48px"
    placeItems="center"
    textTransform="capitalize"
    color={color('bg')}
    bg={stringToHslColor(string, 60, 65)}
    {...rest}
  />
);
