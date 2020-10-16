import { Box } from '@stacks/ui';
import { Title } from '@components/typography';
import { Meta } from '@components/meta-head';
import { PageWrapper } from '@components/page';
import React from 'react';
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

interface InitialData {
  transactions: TransactionResults;
  mempool: MempoolTransactionListResponse;
}

const TransactionsPage: NextPage<InitialData> = initialData => {
  const [transactions, mempool] = useFetchTransactions({
    initialData,
    txLimit: 200,
    mempoolLimit: 50,
  });

  return (
    <PageWrapper>
      <Meta title="Recent transactions" />
      <Box mb="base-loose">
        <Title mt="72px" color="white" as="h1" fontSize="36px">
          Transactions
        </Title>
      </Box>
      {mempool && transactions && <TransactionList mempool={mempool} transactions={transactions} />}
    </PageWrapper>
  );
};

TransactionsPage.getInitialProps = async ({
  store,
}: ReduxNextPageContext): Promise<InitialData> => {
  const apiServer = selectCurrentNetworkUrl(store.getState());

  const [transactions, mempool] = await Promise.all([
    fetchTxList({
      apiServer: apiServer as string,
      limit: 200,
      types: ['smart_contract', 'contract_call', 'token_transfer'],
    })(),
    fetchTxList({
      apiServer: apiServer as string,
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
