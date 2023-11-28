'use client';

import React from 'react';

import { ExplorerSkeletonLoader } from '../../common/components/loaders/skeleton-common';
import { SkeletonTransactionList } from '../../common/components/loaders/skeleton-transaction';
import { TxListTabs } from '../../common/components/tx-lists/tabs/TxListTabs';
import { Flex } from '../../ui/Flex';
import { PageTitle } from '../_components/PageTitle';

export default function Loading() {
  return (
    <Flex direction={'column'} mt="32px" gap="32px">
      <PageTitle>
        <ExplorerSkeletonLoader width={'400px'} height={'31px'} />
      </PageTitle>
      <TxListTabs
        confirmedList={<SkeletonTransactionList />}
        mempoolList={<SkeletonTransactionList />}
      />
    </Flex>
  );
}
