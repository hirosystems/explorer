import React, { useMemo } from 'react';
import { Flex, Box, Grid } from '@stacks/ui';
import { NextPage, NextPageContext } from 'next';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { SearchComponent } from '@components/search/search';

import { Provider } from 'jotai';
import { initialDataAtom } from '@store/query';
import {
  MempoolTransactionsListResponse,
  TransactionQueryKeys,
  TransactionsListResponse,
} from '@store/transactions';
import { getApiClients } from '@common/api/client';
import { BlocksListResponse, BlocksQueryKeys } from '@store/blocks';
import { BlocksList } from '../features/blocks-list';
import { TabbedTransactionList } from '@components/tabbed-transaction-list';

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

interface HomePageData {
  transactions: TransactionsListResponse;
  mempool: MempoolTransactionsListResponse;
  blocks: BlocksListResponse;
}

const Home: NextPage<HomePageData> = ({ transactions, mempool, blocks }) => {
  const initialValues = useMemo(
    () => [
      [initialDataAtom(TransactionQueryKeys.CONFIRMED), transactions] as const,
      [initialDataAtom(TransactionQueryKeys.MEMPOOL), mempool] as const,
      [initialDataAtom(BlocksQueryKeys.CONFIRMED), blocks] as const,
    ],
    [transactions, mempool, blocks]
  );
  return (
    <Provider initialValues={initialValues}>
      <Meta />
      <PageTop />
      <Grid
        mt="extra-loose"
        gap="extra-loose"
        gridTemplateColumns={['100%', '100%', 'calc(60% - 32px) 40%']}
        width="100%"
      >
        <TabbedTransactionList limit={10} />
        <BlocksList limit={10} />
      </Grid>
    </Provider>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { transactionsApi, blocksApi } = await getApiClients(context);
  const transactions = await transactionsApi.getTransactionList({});
  const mempool = await transactionsApi.getMempoolTransactionList({});
  const blocks = await blocksApi.getBlockList({});

  return {
    props: {
      isHome: true,
      transactions,
      mempool,
      blocks,
    },
  };
}

export default Home;
