'use client';

import { Grid } from '@chakra-ui/react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import { DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { isRedesignUrl } from '../common/utils/url-utils';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { PageTitle } from './_components/PageTitle';
import { RecentBlocks } from './_components/RecentBlocks/RecentBlocks';
import { Stats } from './_components/Stats/Stats';

const HomePageBlockListDynamic = dynamic(
  () =>
    import('./_components/BlockList/HomePage/HomePageBlockList').then(mod => mod.HomePageBlockList),
  {
    // loading: () => <HomePageBlockListSkeleton />,
    ssr: false,
  }
);

export function HomePageLayout({
  title,
  stats,
  txListTabs,
  blockList,
}: {
  title: ReactNode;
  stats: ReactNode;
  txListTabs: ReactNode;
  blockList: ReactNode;
}) {
  const isRedesign = isRedesignUrl();
  return (
    <>
      {isRedesign && <RecentBlocks />}
      {title}
      {stats}
      <Grid
        gap="7"
        width="full"
        gridTemplateColumns={['100%', '100%', '100%', 'minmax(0, 0.6fr) minmax(0, 0.4fr)']}
      >
        {txListTabs}
        {blockList}
      </Grid>
    </>
  );
}

const Home: NextPage = () => {
  const { activeNetwork } = useGlobalContext();
  return (
    <HomePageLayout
      title={<PageTitle data-test="homepage-title">Stacks Explorer</PageTitle>}
      stats={!activeNetwork.isSubnet && <Stats />}
      txListTabs={
        <TxListTabs
          limit={DEFAULT_LIST_LIMIT_SMALL}
          showFilterButton={false}
          showValueMenu={false}
        />
      }
      blockList={<HomePageBlockListDynamic />}
    />
  );
};

export default Home;
