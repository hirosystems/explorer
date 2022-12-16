import React from 'react';

import { Grid, GridProps } from '@stacks/ui';

export const Circle: React.FC<GridProps> = ({ size = '72px', borderRadius = size, ...rest }) => (
  <Grid placeItems="center" size={size} borderRadius={borderRadius} {...rest} />
);
