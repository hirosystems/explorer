import React from 'react';
import { Grid } from '@stacks/ui';
import { PageWrapper } from '@components/page-wrapper';
import { Meta } from '@components/meta-head';
import { HomePageTop } from '@components/home-page-top';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { BlocksList } from '@features/blocks-list';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL, IS_BROWSER } from '@common/constants';
import type { NextPage } from 'next';
import { store, wrapper } from '@common/state/store';
import { dehydrate } from 'react-query/hydration';
import { QueryClient } from 'react-query';
import { getHomeQueries } from '@features/home/useHomeQueries';
import { removeKeysWithUndefinedValues } from '@common/utils';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';

const Home: NextPage = () => {
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
    </PageWrapper>
  );
};

const prefetchData = async (networkUrl?: string): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  if (!networkUrl) {
    return queryClient;
  }
  const prefetchOptions = { staleTime: 5000 };
  console.log('[DEBUG] prefetch home', networkUrl, IS_BROWSER);
  const queries = getHomeQueries(networkUrl);
  // test comment
  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      ['blocks'],
      queries.fetchBlocks(DEFAULT_BLOCKS_LIST_LIMIT, 0),
      prefetchOptions
    ),
    queryClient.prefetchInfiniteQuery(
      ['confirmedTransactions'],
      queries.fetchConfirmedTransactions(DEFAULT_LIST_LIMIT_SMALL, 0),
      prefetchOptions
    ),
    queryClient.prefetchInfiniteQuery(
      ['mempoolTransactions'],
      queries.fetchMempoolTransactions(DEFAULT_LIST_LIMIT_SMALL, 0),
      prefetchOptions
    ),
  ]);
  return queryClient;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
  const client = await prefetchData(selectActiveNetworkUrl(store.getState()));
  return {
    props: {
      isHome: true,
      dehydratedState: removeKeysWithUndefinedValues(dehydrate(client)),
    },
  };
});

export default Home;
