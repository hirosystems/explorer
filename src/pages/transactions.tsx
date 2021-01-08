import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { TransactionList } from '@components/transaction-list';
import { fetchTxList } from '@common/api/transactions';
import {
  TransactionResults,
  MempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-sidecar-types';
import { NextPage, NextPageContext } from 'next';
import { useInfiniteFetch } from '@common/hooks/use-fetch-blocks';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { getServerSideApiServer } from '@common/api/utils';

interface InitialData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
}

const TransactionsPage: NextPage<InitialData> = initialData => {
  const {
    data: transactions,
    loadMore,
    isReachingEnd,
    isLoadingMore,
  } = useInfiniteFetch<Transaction>({
    initialData: initialData.transactions.results,
    type: 'tx',
    limit: 25,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const { data: mempool } = useInfiniteFetch<MempoolTransaction>({
    initialData: initialData.mempool.results,
    type: 'tx',
    limit: 25,
    pending: true,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  return (
    <>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Transactions
        </Title>
      </Box>
      <TransactionList
        mempool={mempool || []}
        transactions={transactions || []}
        loadMore={loadMore}
        isReachingEnd={isReachingEnd}
        isLoadingMore={isLoadingMore}
        hideFilter={false}
      />
    </>
  );
};

TransactionsPage.getInitialProps = async (ctx: NextPageContext): Promise<InitialData> => {
  const apiServer = await getServerSideApiServer(ctx);

  const [transactions, mempool] = await Promise.all([
    fetchTxList({
      apiServer,
      limit: 50,
      types: ['smart_contract', 'contract_call', 'token_transfer'],
    })(),
    fetchTxList({
      apiServer,
      limit: 25,
      mempool: true,
    })(),
  ]);

  return {
    transactions: transactions as InitialData['transactions'],
    mempool: mempool as InitialData['mempool'],
  };
};

export default TransactionsPage;
