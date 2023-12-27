'use client';

import React from 'react';

import { Grid, GridProps } from '../../ui/Grid';

export const Circle: React.FC<GridProps> = ({ size, ...rest }) => (
  <Grid placeItems="center" border={'1px'} size={size} rounded={'full'} {...rest} />
);
