import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL, IS_BROWSER } from '@common/constants';
import { selectActiveNetworkUrl } from '@common/state/network-slice';
import { wrapper } from '@common/state/store';
import { removeKeysWithUndefinedValues } from '@common/utils';
import { HomePageTop } from '@components/home-page-top';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page-wrapper';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';
import { BlocksList } from '@features/blocks-list';
import { getHomeQueries } from '@features/home/useHomeQueries';
import { Grid } from '@stacks/ui';
import type { NextPage } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

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
  const prefetchOptions = { retry: 0, staleTime: 5000 };
  console.log('[DEBUG] prefetch home', networkUrl, IS_BROWSER);
  const queries = getHomeQueries(networkUrl);

  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      ['confirmedTransactions'],
      queries.fetchConfirmedTransactions(DEFAULT_LIST_LIMIT_SMALL, 0),
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
