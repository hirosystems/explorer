'use client';

import React from 'react';

import { Circle } from '../../../../common/components/Circle';

export function DefaultTokenImage({ asset }: { asset: string }) {
  return (
    <Circle size={6} mr={4}>
      {asset[0].toUpperCase()}
    </Circle>
  );
}
