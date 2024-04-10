'use client';

import dynamic from 'next/dynamic';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useAppContext';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { Grid } from '../ui/Grid';
import { SkeletonBlockList } from './_components/BlockList/SkeletonBlockList';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';
import { NextPage } from 'next';

const BlocksListDynamic = dynamic(
  () => import('./_components/BlockList').then(mod => mod.BlocksList),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

const HomePageBlockListDynamic = dynamic(
  () =>
    import('./_components/BlockList/HomePage/HomePageBlockList').then(mod => mod.HomePageBlockList),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);

const Home: NextPage = () => {
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
        <TxListTabs limit={DEFAULT_LIST_LIMIT_SMALL} showFilterButton={false} />
        {activeNetworkKey.indexOf('naka') !== -1 || activeNetworkKey.indexOf('testnet') !== -1 ? (
          <HomePageBlockListDynamic />
        ) : (
          <BlocksListDynamic limit={DEFAULT_BLOCKS_LIST_LIMIT} />
        )}
      </Grid>
    </>
  );
}

export default Home;
