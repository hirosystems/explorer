import * as React from 'react';
import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import { ReduxNextPageContext } from '@common/types/next-store';
import { TransactionList } from '@components/transaction-list';
import { fetchTxList } from '@common/api/transactions';
import { selectCurrentNetworkUrl } from '@store/ui/selectors';
import { useFetchTransactions } from '@common/hooks/use-fetch-transactions';
import {
  TransactionResults,
  MempoolTransactionListResponse,
} from '@blockstack/stacks-blockchain-sidecar-types';
import { NextPage } from 'next';
import { useInfiniteFetch } from '@common/hooks/use-fetch-blocks';

interface InitialData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
}

const TransactionsPage: NextPage<InitialData> = initialData => {
  const { data: transactions, loadMore, isReachingEnd, isLoadingMore } = useInfiniteFetch<
    TransactionResults['results']
  >({
    initialData: initialData.transactions.results,
    type: 'tx',
    limit: 50,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  const { data: mempool } = useInfiniteFetch<MempoolTransactionListResponse['results']>({
    initialData: initialData.mempool.results,
    type: 'tx',
    limit: 25,
    pending: true,
    types: ['smart_contract', 'contract_call', 'token_transfer'],
  });

  return (
    <PageWrapper>
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
      />
    </PageWrapper>
  );
};

TransactionsPage.getInitialProps = async ({
  store,
}: ReduxNextPageContext): Promise<InitialData> => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

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
