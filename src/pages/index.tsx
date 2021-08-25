import React from 'react';
import type { NextPage } from 'next';
import { withInitialQueries } from 'jotai-query-toolkit/nextjs';
import { Grid } from '@stacks/ui';
import { PageWrapper } from '@components/page-wrapper';
import { Meta } from '@components/meta-head';
import { HomePageTop } from '@components/home-page-top';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { BlocksList } from '@features/blocks-list';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { getHomePageQueries } from '@common/page-queries/home';
import { pageAtomBuilders } from '@common/page-queries/extra-initial-values';
import { useNetworkToast } from '@common/hooks/use-network-toast';
import { NetworkModeToast } from '@components/network-mode-toast';

const Home: NextPage = () => {
  useNetworkToast();
  return (
    <PageWrapper>
      <Meta />
      <HomePageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <TabbedTransactionList limit={DEFAULT_LIST_LIMIT_SMALL} />
        <BlocksList enforceLimit limit={DEFAULT_BLOCKS_LIST_LIMIT} />
      </Grid>
      <NetworkModeToast />
    </PageWrapper>
  );
};

Home.getInitialProps = () => {
  return { isHome: true };
};

export default withInitialQueries(Home, pageAtomBuilders)(getHomePageQueries);
