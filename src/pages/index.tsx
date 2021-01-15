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
import { SearchComponent } from '@components/search/search';
import { fetchTxList } from '@common/api/transactions';
import { fetchBlocksList, FetchBlocksListResponse } from '@common/api/blocks';
import { HomeTxs } from '@components/new-tx-component';
import { getServerSideApiServer } from '@common/api/utils';
import { useApiServer } from '@common/hooks/use-api';
import useSWR from 'swr';

interface FetchHomepageDataResponse {
  transactions: TransactionResults;
  blocks: FetchBlocksListResponse;
}

const fetchHomepageData = (apiServer: string) => async (): Promise<FetchHomepageDataResponse> => {
  const [transactions, blocks] = await Promise.all([
    fetchTxList({
      apiServer,
      limit: 10,
      types: ['smart_contract', 'contract_call', 'token_transfer'],
    })(),
    fetchBlocksList({
      apiServer,
      limit: 10,
    })(),
  ]);

  return {
    transactions: transactions as TransactionResults,
    blocks,
  };
};

const PageTop: React.FC = React.memo(() => (
  <Flex
    width="100%"
    flexDirection="column"
    alignItems="center"
    maxWidth={['100%', '100%', 'calc(60% - 32px)']}
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
  blocks: FetchBlocksListResponse;
}

export const useHomepageData = (initialData?: HomeData) => {
  const apiServer = useApiServer();

  const { data, mutate } = useSWR<FetchHomepageDataResponse>(
    'home',
    () => fetchHomepageData(apiServer)(),
    {
      initialData,
      suspense: false,
    }
  );

  return {
    data,
    refresh: mutate,
  };
};

const Home: NextPage<any> = React.memo(({ mempool, ...props }) => {
  const { data } = useHomepageData(props);
  if (!data) {
    return null;
  }
  return (
    <>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <HomeTxs confirmed={data.transactions.results} mempool={mempool.results} />

        <BlocksList blocks={data.blocks.results} />
      </Grid>
    </>
  );
});

export async function getServerSideProps(ctx: NextPageContext) {
  const apiServer = await getServerSideApiServer(ctx);
  const data = await fetchHomepageData(apiServer)();
  const mempool = await fetchTxList({
    apiServer,
    limit: 10,
    mempool: true,
  })();

  return {
    props: {
      ...data,
      mempool,
      isHome: true,
    },
  };
}

export default Home;
