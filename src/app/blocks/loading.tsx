'use client';

import React from 'react';

import { ExplorerSkeletonLoader } from '../../common/components/loaders/skeleton-common';
import { SkeletonBlockList } from '../../common/components/loaders/skeleton-text';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';

export default function Loading() {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <ExplorerSkeletonLoader width={'400px'} height={'31px'} />
      </PageTitle>
      <SkeletonBlockList />
    </Flex>
  );
}
