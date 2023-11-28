'use client';

import React from 'react';

import { Circle } from '../../../../ui/Circle';

export function DefaultTokenImage({ asset }: { asset: string }) {
  return (
    <Circle size="36px" mr="16px">
      {asset[0].toUpperCase()}
    </Circle>
  );
}
