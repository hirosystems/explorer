'use client';

import React from 'react';

import { Circle } from '../../../../common/components/Circle';

export function DefaultTokenImage({ asset }: { asset: string }) {
  return (
    <Circle h={6} w={6} mr={4}>
      {asset[0].toUpperCase()}
    </Circle>
  );
}
