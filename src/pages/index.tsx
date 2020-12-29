import * as React from 'react';
import { Flex, Box, Grid } from '@stacks/ui';
import type {
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { NextPage, NextPageContext } from 'next';
import { Title } from '@components/typography';
import { BlocksList } from '@components/blocks-list';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import { SearchComponent } from '@components/search/search';
import { TransactionList } from '@components/transaction-list';
import { fetchTxList } from '@common/api/transactions';
import { fetchBlocksList, FetchBlocksListResponse } from '@common/api/blocks';

import { getServerSideApiServer } from '@common/api/utils';
import { useApiServer } from '@common/hooks/use-api';
import useSWR from 'swr';

interface FetchHomepageDataResponse {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
  blocks: FetchBlocksListResponse;
}
const fetchHomepageData = (apiServer: string) => async (): Promise<FetchHomepageDataResponse> => {
  const [transactions, mempool, blocks] = await Promise.all([
    fetchTxList({
      apiServer,
      limit: 10,
      types: ['smart_contract', 'contract_call', 'token_transfer'],
    })(),
    fetchTxList({
      apiServer,
      limit: 10,
      mempool: true,
    })(),
    fetchBlocksList({
      apiServer,
      limit: 10,
    })(),
  ]);

  return {
    transactions: transactions as TransactionResults,
    mempool: mempool as MempoolTransactionListResponse,
    blocks,
  };
};

const PageTop: React.FC = React.memo(() => (
  <Flex
    width="100%"
    flexDirection="column"
    alignItems="center"
    maxWidth="calc(60% - 32px)"
    justify="center"
  >
    <Title
      as="h1"
      fontSize="36px"
      display="block"
      width="100%"
      textAlign={['center', 'left']}
      mt="72px"
      mb="extra-loose"
      color="white"
    >
      Stacks Explorer
    </Title>
    <Box width="100%">
      <SearchComponent />
    </Box>
  </Flex>
));

interface HomeData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
  blocks: FetchBlocksListResponse;
}

export const useHomepageData = (initialData?: HomeData) => {
  const apiServer = useApiServer();

  const { data, mutate } = useSWR<FetchHomepageDataResponse>(
    'home',
    () => fetchHomepageData(apiServer)(),
    {
      initialData,
    }
  );

  return {
    data,
    refresh: mutate,
  };
};

const Home: NextPage<HomeData> = React.memo(initialData => {
  const { data } = useHomepageData(initialData);
  if (!data) {
    return null;
  }
  return (
    <PageWrapper isHome>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <TransactionList
          recent
          transactions={data.transactions.results}
          mempool={data.mempool.results}
          limit={10}
        />

        <BlocksList blocks={data.blocks.results} />
      </Grid>
    </PageWrapper>
  );
});

export async function getServerSideProps(ctx: NextPageContext) {
  const apiServer = await getServerSideApiServer(ctx);
  const data = await fetchHomepageData(apiServer)();
  return {
    props: data,
  };
}

export default Home;
