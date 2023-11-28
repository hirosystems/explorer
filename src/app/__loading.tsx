'use client';

import * as React from 'react';

import { ExplorerSkeletonLoader } from '../common/components/loaders/skeleton-common';
import { SkeletonBlockList } from '../common/components/loaders/skeleton-text';
import { SkeletonTransactionList } from '../common/components/loaders/skeleton-transaction';
import { TxListTabs } from '../common/components/tx-lists/tabs/TxListTabs';
import { Grid } from '../ui/Grid';
import { PageTitle } from './_components/PageTitle';
import { SkeletonStatSection } from './_components/Stats/SkeletonStatSection';
import { Wrapper as StatsWrapper } from './_components/Stats/Wrapper';

export default function __loading() {
  return (
    <Grid
      mt="32px"
      gap="32px"
      width="100%"
      gridTemplateColumns={['100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
    >
      <PageTitle>
        <ExplorerSkeletonLoader width={'400px'} height={'31px'} />
      </PageTitle>
      <StatsWrapper>
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '0px', '1px']} />
        <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />
        <SkeletonStatSection />
      </StatsWrapper>
      <TxListTabs
        confirmedList={<SkeletonTransactionList />}
        mempoolList={<SkeletonTransactionList />}
      />
      <SkeletonBlockList />
    </Grid>
  );
}
