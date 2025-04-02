'use client';

import { Flex, Grid } from '@chakra-ui/react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

import { DEFAULT_LIST_LIMIT_SMALL } from '../common/constants/constants';
import { useGlobalContext } from '../common/context/useGlobalContext';
import { useIsRedesignUrl } from '../common/utils/url-utils';
import { TxListTabs } from '../features/txs-list/tabs/TxListTabs';
import { FeeSection } from './_components/FeeSection';
import { MempoolSection } from './_components/MempoolSection';
import { NetworkOverview } from './_components/NetworkOverview/NetworkOverview';
import { PageTitle } from './_components/PageTitle';
import { RecentBlocks } from './_components/RecentBlocks/RecentBlocks';
import { StackingSection } from './_components/StackingSection/StackingSection';
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
  const isRedesign = useIsRedesignUrl();
  return (
    <>
      {isRedesign && <RecentBlocks />}
      {isRedesign && (
        <Flex flex="0 0 50%">
          <MempoolSection />
        </Flex>
      )}
      {isRedesign && (
        <Flex flex="0 0 50%">
          <FeeSection />
        </Flex>
      )}
      {isRedesign && (
        <Flex flex="0 0 50%" w={'50%'}>
          <NetworkOverview />
        </Flex>
      )}
      {isRedesign && (
        <Flex flex="0 0 50%" w="50%">
          <StackingSection />
        </Flex>
      )}
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
