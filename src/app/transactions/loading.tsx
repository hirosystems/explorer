'use client';

import React from 'react';

import { SkeletonTxsList } from '../../features/txs-list/SkeletonTxsList';
import { TxListTabsBase } from '../../features/txs-list/tabs/TxListTabsBase';
import { Flex } from '../../ui/Flex';
import { Skeleton } from '../../ui/Skeleton';
import { PageTitle } from '../_components/PageTitle';

export default function Loading() {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <Skeleton width={'400px'} height={'43px'} />
      </PageTitle>
      <TxListTabsBase confirmedList={<SkeletonTxsList />} mempoolList={<SkeletonTxsList />} />
    </Flex>
  );
}
