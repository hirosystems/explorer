import * as React from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import getConfig from 'next/config';

import { Flex, Box, Grid } from '@stacks/ui';
import {
  Block,
  MempoolTransaction,
  MempoolTransactionListResponse,
  Transaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { NextPage, NextPageContext } from 'next';
import { Title } from '@components/typography';
import { BlocksList } from '@components/blocks-list';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import { SearchBarWithDropdown } from '@components/search-bar';
import { TransactionList } from '@components/transaction-list';
import { fetchTxList } from '@common/api/transactions';
import Head from 'next/head';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { fetchBlocksList, FetchBlocksListResponse } from '@common/api/blocks';
import { makeKey, useInfiniteFetch } from '@common/hooks/use-fetch-blocks';
import { useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { apiServerState } from '@store/recoil';
import { getServerSideApiServer } from '@common/api/utils';

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
  const apiServer = useRecoilValue(apiServerState);

  const transactions = useInfiniteFetch<Transaction>({
    initialData: initialData?.transactions?.results || [],
    type: 'tx',
    limit: 10,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const mempool = useInfiniteFetch<MempoolTransaction>({
    initialData: initialData?.mempool?.results || [],
    type: 'tx',
    limit: 10,
    pending: true,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const blocks = useInfiniteFetch<Block>({
    initialData: initialData?.blocks?.results || [],
    type: 'block',
    limit: 10,
  });

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

  const keys = [txKey, mempoolKey, blockKey];

  return {
    keys,
    transactions,
    mempool,
    blocks,
    refresh: () => {
      transactions?.refresh?.();
      mempool?.refresh?.();
      blocks?.refresh?.();
    },
  };
};

const Home: NextPage<HomeData> = initialData => {
  const { transactions, mempool, blocks, keys } = useHomepageData(initialData);
  return (
    <PageWrapper isHome>
      <Head>
        {keys.map(key => (
          <link rel="preload" href={key} as="fetch" crossOrigin="anonymous" key={key} />
        ))}
      </Head>
      <Meta />
      <PageTop />
      <TransactionList
        my="extra-loose"
        recent
        transactions={transactions.data}
        mempool={mempool.data}
      />

      <BlocksList blocks={blocks.data} />
    </PageWrapper>
  );
};

Home.getInitialProps = async (ctx: NextPageContext) => {
  const apiServer = getServerSideApiServer(ctx);
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
    transactions: transactions as HomeData['transactions'],
    mempool: (mempool as unknown) as HomeData['mempool'],
    blocks,
  };
};

export default Home;
