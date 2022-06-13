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
import { store, wrapper } from '@common/state/store';
import { dehydrate } from 'react-query/hydration';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { ServerResponse } from 'http';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';
import { DEFAULT_BLOCKS_LIST_LIMIT } from '@common/constants';
import { getHomeQueries } from '@features/home/useHomeQueries';

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
  txPageQuery: string,
  res: ServerResponse,
  networkUrl?: string
): Promise<QueryClient> => {
  const queryClient = new QueryClient();
  if (!networkUrl) {
    return queryClient;
  }
  const prefetchOptions = { staleTime: 5000 };
  const queries = getTransactionQueries(networkUrl);
  const homeQueries = getHomeQueries(networkUrl);
  try {
    const [{ transaction }] = await Promise.all([
      queryClient.fetchQuery(
        transactionQK(TransactionQueryKeys.transaction, txPageQuery),
        queries.fetchTransaction(txPageQuery),
        prefetchOptions
      ),
      queryClient.prefetchInfiniteQuery(
        [TransactionQueryKeys.lastThreeBlocks],
        homeQueries.fetchBlocks(3, 0),
        prefetchOptions
      ),
    ]);
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
    query.txid as string,
    res,
    selectActiveNetworkUrl(store.getState())
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
