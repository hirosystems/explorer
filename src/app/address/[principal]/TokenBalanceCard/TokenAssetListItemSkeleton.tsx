'use client';

import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import { Circle } from '../../../../ui/Circle';
import { Spinner } from '../../../../ui/Spinner';
import { TokenAssetListItemLayout } from './TokenAssetListItemLayout';

export function TokenAssetListItemSkeleton() {
  return (
    <TokenAssetListItemLayout
      icon={
        <Circle size="36px" mr="16px">
          <Spinner color="gray.400" />
        </Circle>
      }
      asset={<Skeleton height="20px" width={'120px'} />}
      symbol={<Skeleton height="20px" width={'20px'} />}
      link={<Skeleton height="20px" width={'60px'} />}
      amount={<Skeleton height="20px" width={'20px'} />}
    />
  );
}
