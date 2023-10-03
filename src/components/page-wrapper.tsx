import React from 'react';
import { Grid, GridProps } from '@/ui/components';

export function PageWrapper({ fullWidth, ...props }: { fullWidth?: boolean } & GridProps) {
  return (
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
}
