import { Grid, GridProps } from '@/ui/components';
import React from 'react';

export const Circle: React.FC<GridProps> = ({ size = '72px', borderRadius = size, ...rest }) => (
  <Grid placeItems="center" size={size} borderRadius={borderRadius} {...rest} />
);
