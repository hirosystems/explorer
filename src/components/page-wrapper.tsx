import { Grid, GridProps } from '@/ui/components';
import React from 'react';

export const PageWrapper: React.FC<{ fullWidth?: boolean } & GridProps> = ({
  fullWidth,
  ...props
}) => (
  <Grid
    gridColumnGap="32px"
    gridTemplateColumns={
      !fullWidth ? ['100%', '100%', 'repeat(1, calc(100% - 352px) 320px)'] : '100%'
    }
    gridRowGap={['32px', '32px', 'unset']}
    maxWidth="100%"
    alignItems="flex-start"
    {...props}
  />
);
