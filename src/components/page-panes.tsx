import React from 'react';
import { Grid, GridProps } from '@stacks/ui';

export const PagePanes: React.FC<{ fullWidth?: boolean } & GridProps> = ({
  fullWidth,
  ...props
}) => (
  <Grid
    gridColumnGap="extra-loose"
    gridTemplateColumns={
      !fullWidth ? ['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)'] : '100%'
    }
    gridRowGap={['extra-loose', 'extra-loose', 'unset']}
    maxWidth="100%"
    alignItems="flex-start"
    {...props}
  />
);
