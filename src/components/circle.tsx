import React from 'react';
import { Grid, GridProps } from '@/ui/components';

export function Circle({ size = '72px', borderRadius = size, ...rest }: GridProps) {
  return <Grid placeItems="center" size={size} borderRadius={borderRadius} {...rest} />;
}
