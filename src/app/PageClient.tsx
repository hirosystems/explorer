'use client';

import { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { Grid } from '../ui/Grid';
import { HomePageBlockListSkeleton } from './_components/BlockList/Grouped/skeleton';
import { PageTitle } from './_components/PageTitle';
import { Stats } from './_components/Stats/Stats';

const HomePageBlockListDynamic = dynamic(
  () =>
    import('./_components/BlockList/HomePage/HomePageBlockList').then(mod => mod.HomePageBlockList),
  {
    loading: () => <HomePageBlockListSkeleton />,
    ssr: false,
  }
);

const Home: NextPage = () => {
  const { activeNetwork } = useGlobalContext();

  return (
    <>
      <PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>
      {!activeNetwork.isSubnet && <Stats />}
      <Grid
        gap="7"
        width="full"
        gridTemplateColumns={['100%', '100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
      >
        <TxListTabs
          limit={DEFAULT_LIST_LIMIT_SMALL}
          showFilterButton={false}
          showValueMenu={false}
        />
        <HomePageBlockListDynamic />
      </Grid>
    </>
  );
};

export default Home;
