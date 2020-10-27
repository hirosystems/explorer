import * as React from 'react';

import { Flex, Grid } from '@stacks/ui';
import {
  MempoolTransactionListResponse,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { NextPage, NextPageContext } from 'next';
import { Title } from '@components/typography';

import { BlocksList } from '@components/blocks-list';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';

import { ReduxNextPageContext } from '@common/types/next-store';
import { SearchBarWithDropdown } from '@components/search-bar';
import { TransactionList } from '@components/transaction-list';
import { fetchTxList } from '@common/api/transactions';
import Head from 'next/head';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { fetchBlocksList, FetchBlocksListResponse } from '@common/api/blocks';
import { makeKey, useInfiniteFetch } from '@common/hooks/use-fetch-blocks';
import { useSelector } from 'react-redux';
import { RootState } from '@store';

const PageTop: React.FC = React.memo(() => (
  <Flex flexDirection="column" alignItems="center" maxWidth="544px" justify="center">
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
    <SearchBarWithDropdown />
  </Flex>
));

interface HomeData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
  blocks: FetchBlocksListResponse;
}

export const useHomepageData = (initialData?: HomeData) => {
  const transactions = useInfiniteFetch<TransactionResults['results']>({
    initialData: initialData?.transactions?.results || [],
    type: 'tx',
    limit: 10,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const mempool = useInfiniteFetch<MempoolTransactionListResponse['results']>({
    initialData: initialData?.mempool?.results || [],
    type: 'tx',
    limit: 10,
    pending: true,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const blocks = useInfiniteFetch<FetchBlocksListResponse['results']>({
    initialData: initialData?.blocks?.results || [],
    type: 'block',
    limit: 10,
  });

  return {
    transactions,
    mempool,
    blocks,
  };
};
export const Home: NextPage<HomeData> = initialData => {
  const { transactions, mempool, blocks } = useHomepageData(initialData);

  const { apiServer } = useSelector((state: RootState) => ({
    apiServer: selectCurrentNetworkUrl(state),
  }));
  const txKey = makeKey({
    apiServer,
    index: 0,
    type: 'tx',
    limit: 10,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });
  const mempoolKey = makeKey({
    apiServer,
    index: 0,
    type: 'tx',
    limit: 10,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
    pending: true,
  });
  const blockKey = makeKey({
    apiServer,
    index: 0,
    type: 'block',
    limit: 10,
  });

  return (
    <PageWrapper isHome>
      <Head>
        <link rel="preload" href={txKey} as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href={mempoolKey} as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href={blockKey} as="fetch" crossOrigin="anonymous" />
      </Head>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        alignItems="flex-start"
        gap="extra-loose"
        gridTemplateColumns="repeat(1, 1fr)"
      >
        <TransactionList recent transactions={transactions.data} mempool={mempool.data} />
        <BlocksList blocks={blocks.data} />
      </Grid>
    </PageWrapper>
  );
};

Home.getInitialProps = async ({
  store,
}: NextPageContext & ReduxNextPageContext): Promise<HomeData> => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

  const [transactions, mempool, blocks] = await Promise.all([
    fetchTxList({
      apiServer: apiServer as string,
      limit: 10,
      types: ['smart_contract', 'contract_call', 'token_transfer'],
    })(),
    fetchTxList({
      apiServer: apiServer as string,
      limit: 10,
      mempool: true,
    })(),
    fetchBlocksList({
      apiServer: apiServer as string,
      limit: 10,
    })(),
  ]);

  return {
    transactions: transactions as HomeData['transactions'],
    mempool: (mempool as unknown) as HomeData['mempool'],
    blocks,
  };
};

export default Home;
