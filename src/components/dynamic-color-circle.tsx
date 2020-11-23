import React from 'react';
import { stringToHslColor } from '@common/utils';
import { color, Grid, GridProps } from '@stacks/ui';
import { generateHash, hashValue } from '@components/colors';

export const DynamicColorCircle: React.FC<{ string: string } & GridProps> = ({
  string,
  children,
  ...rest
}) => {
  const color1 = stringToHslColor(`${string}`, 80, 60);
  const color2 = stringToHslColor(`${string.split('.')[0]}`, 60, 65);
  const color3 = stringToHslColor(`${string.split('.')[1]}`, 80, 60);
  return (
    <Grid
      borderRadius="100%"
      mr="base"
      size="48px"
      placeItems="center"
      textTransform="capitalize"
      color={color('bg')}
      flexShrink={0}
      backgroundImage={`radial-gradient(${hashValue(string.split('.')[0], [
        'circle',
        'closest-side',
        'ellipse',
      ])} at ${generateHash(string) % 100}%, ${color1} 0%, ${color2} 60%, ${color3} 100%)`}
      position="relative"
      fontWeight="500"
      {...rest}
    >
      {children}
    </Grid>
  );
};
