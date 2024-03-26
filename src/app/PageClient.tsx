'use client';

import dynamic from 'next/dynamic';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useAppContext';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { Grid } from '../ui/Grid';
import { SkeletonBlockList } from './_components/BlockList/SkeletonBlockList';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';

const NonPaginatedBlockListLayoutA = dynamic(
  () =>
    import('./_components/BlockList/LayoutA/NonPaginated').then(
      mod => mod.NonPaginatedBlockListLayoutA
    ),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

const HomePageBlockListGroupedByBtcBlock = dynamic(
  () =>
    import('./_components/BlockList/GroupedByBurnBlock/HomePageBlockListGroupedByBtcBlock').then(
      mod => mod.HomePageBlockListGroupedByBtcBlock
    ),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

const BlocksList = dynamic(() => import('./_components/BlockList').then(mod => mod.BlocksList), {
  loading: () => <SkeletonBlockList />,
  ssr: false,
});

export default function Home() {
  const { activeNetwork, activeNetworkKey } = useGlobalContext();
  return (
    <>
      <PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>
      {!activeNetwork.isSubnet && <Stats />}
      <Grid
        gap="7"
        width="full"
        gridTemplateColumns={['100%', '100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
      >
        <TxListTabs limit={DEFAULT_LIST_LIMIT_SMALL} />

        {activeNetworkKey.indexOf('naka') !== -1 ? (
          <HomePageBlockListGroupedByBtcBlock />
        ) : (
          <BlocksList limit={DEFAULT_BLOCKS_LIST_LIMIT} />
        )}
      </Grid>
    </>
  );
}
