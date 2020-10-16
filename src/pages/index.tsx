import { Flex, Grid } from '@stacks/ui';
import {
  MempoolTransactionListResponse,
  Transaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { NextPage, NextPageContext } from 'next';
import { Text, Title } from '@components/typography';

import { BlocksList } from '@components/blocks-list';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import React from 'react';
import { ReduxNextPageContext } from '@common/types/next-store';
import { SearchBarWithDropdown } from '@components/search-bar';
import { TransactionList } from '@components/transaction-list';
import { doFetchBlocks } from '@store/blocks';
import { fetchTxList } from '@common/api/transactions';

import { selectCurrentNetworkUrl } from '@store/ui/selectors';

import { useFetchTransactions } from '@common/hooks/use-fetch-transactions';

const PageTop: React.FC = () => (
  <Flex flexDirection="column" align="center" maxWidth="544px" justify="center">
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
);

interface HomeData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
}

export const Home: NextPage<HomeData> = ({ transactions, mempool }) => {
  const [tx, mem] = useFetchTransactions({
    initialData: { transactions, mempool },
  });

  return (
    <PageWrapper isHome>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        alignItems="flex-start"
        gap="extra-loose"
        gridTemplateColumns="repeat(1, 1fr)"
      >
        {tx && mem && <TransactionList recent transactions={tx} mempool={mem} />}
        <BlocksList />
      </Grid>
    </PageWrapper>
  );
};

Home.getInitialProps = async ({
  store,
}: NextPageContext & ReduxNextPageContext): Promise<HomeData> => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

  const [transactions, mempool] = await Promise.all([
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
    await store.dispatch(
      doFetchBlocks({
        limit: 10,
      })
    ),
  ]);

  return {
    transactions: transactions as HomeData['transactions'],
    mempool: (mempool as unknown) as HomeData['mempool'],
  };
};

export default Home;
