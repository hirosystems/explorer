'use client';

import { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useAppContext';
import { NetworkModes } from '../common/types/network';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { Grid } from '../ui/Grid';
import { SkeletonBlockList } from './_components/BlockList/SkeletonBlockList';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';

const UpdatedBlockListDynamic = dynamic(
  () => import('./_components/BlockList/UpdatedBlockList').then(mod => mod.UpdatedBlocksList),
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
  const { activeNetworkKey, activeNetwork } = useGlobalContext();
  const chain = activeNetwork.mode;
  const isNakaTestnet = chain === NetworkModes.Testnet && activeNetworkKey.indexOf('naka') !== -1;
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
        {isNakaTestnet ? (
          <HomePageBlockListDynamic />
        ) : (
          <UpdatedBlockListDynamic limit={DEFAULT_BLOCKS_LIST_LIMIT} />
        )}
      </Grid>
    </>
  );
};

export default Home;
