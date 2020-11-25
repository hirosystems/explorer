import React from 'react';
import { color, Grid, GridProps } from '@stacks/ui';
import { useGradients } from '@common/hooks/use-gradients';

export const DynamicColorCircle: React.FC<{ string: string } & GridProps> = ({
  string,
  children,
  ...rest
}) => {
  const { getGradient } = useGradients();
  const gradient = getGradient(string);

  return (
    <Grid
      borderRadius="100%"
      size="48px"
      placeItems="center"
      textTransform="capitalize"
      color={color('bg')}
      flexShrink={0}
      backgroundImage={gradient}
      position="relative"
      fontWeight="500"
      {...rest}
    >
      {children}
    </Grid>
  );
};
