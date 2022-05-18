import * as React from 'react';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';

import { getContractId, removeKeysWithUndefinedValues } from '@common/utils';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

import type { NextPage } from 'next';
import { Meta } from '@components/meta-head';
import { TxNotFound } from '@components/tx-not-found';
import { InView } from '@store/currently-in-view';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { QueryClient } from 'react-query';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { wrapper } from '@common/state/store';
import { dehydrate } from 'react-query/hydration';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { ServerResponse } from 'http';

interface TransactionPageProps {
  inView: InView;
  isPossiblyValid?: boolean;
  error?: boolean;
}

const TransactionPage: NextPage<TransactionPageProps> = ({ error, isPossiblyValid }) => {
  if (error)
    return (
      <>
        <Meta title="Transaction not found" />
        <TxNotFound isPending={isPossiblyValid} />
      </>
    );
  useRefreshOnBack('txid');
  return (
    <>
      <UnlockingScheduleModal />
      <TransactionMeta />
      <TransactionPageComponent />
    </>
  );
};

const prefetchData = async (
  networkUrl: string,
  txPageQuery: string,
  res: ServerResponse
): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  const prefetchOptions = { staleTime: 5000 };
  const queries = getTransactionQueries(networkUrl);
  try {
    const { transaction } = await queryClient.fetchQuery(
      transactionQK(TransactionQueryKeys.transaction, txPageQuery),
      queries.fetchTransaction(txPageQuery),
      prefetchOptions
    );
    const contractId = getContractId(txPageQuery, transaction);
    if (contractId) {
      await Promise.all([
        queryClient.prefetchInfiniteQuery(
          transactionQK(TransactionQueryKeys.mempoolTransactionsForAddress, contractId),
          queries.fetchMempoolTransactionsForAddress(contractId),
          prefetchOptions
        ),
        queryClient.prefetchInfiniteQuery(
          transactionQK(TransactionQueryKeys.transactionsForAddress, contractId),
          queries.fetchTransactionsForAddress(contractId),
          prefetchOptions
        ),
        queryClient.prefetchQuery(
          transactionQK(TransactionQueryKeys.contract, contractId),
          queries.fetchContract(contractId),
          prefetchOptions
        ),
        queryClient.prefetchQuery(
          transactionQK(TransactionQueryKeys.accountBalance, contractId),
          queries.fetchAccountBalance(contractId),
          prefetchOptions
        ),
      ]);
    }
  } catch (err) {
    res.statusCode = err.status;
  }
  return queryClient;
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query, res }) => {
  const client = await prefetchData(
    store.getState().network.activeNetworkKey,
    query.txid as string,
    res
  );
  console.log(res.statusCode);
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return {
      notFound: true,
    };
  }
  if (res.statusCode >= 500) {
    throw res;
  }
  return {
    props: {
      isHome: false,
      dehydratedState: removeKeysWithUndefinedValues(dehydrate(client)),
    },
  };
});

export default TransactionPage;
