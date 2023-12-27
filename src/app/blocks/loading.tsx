'use client';

import React from 'react';

import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { Flex } from '../../ui/Flex';
import { Skeleton } from '../../ui/Skeleton';
import { PageTitle } from '../_components/PageTitle';

export default function Loading() {
  return (
    <>
      <PageTitle>
        <Skeleton width={'400px'} height={'43px'} />
      </PageTitle>
      <SkeletonBlockList />
    </>
  );
}
