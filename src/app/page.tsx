'use client';

import dynamic from 'next/dynamic';
import * as React from 'react';

import { SkeletonBlockList } from '../common/components/loaders/skeleton-text';
import { DefaultTxListTabs } from '../common/components/tx-lists/tabs/DefaultTxListTabs';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useAppContext';
import { Grid } from '../ui/Grid';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';

const BlocksList = dynamic(() => import('./_components/BlockList').then(mod => mod.BlocksList), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});

export default function Home() {
  const { activeNetwork } = useGlobalContext();
  return (
    <Grid
      mt="32px"
      gap="32px"
      width="100%"
      gridTemplateColumns={['100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
    >
      <PageTitle>Stacks Explorer</PageTitle>
      {!activeNetwork.isSubnet && <Stats />}
      <DefaultTxListTabs limit={DEFAULT_LIST_LIMIT_SMALL} />
      <BlocksList limit={DEFAULT_BLOCKS_LIST_LIMIT} />
    </Grid>
  );
}
