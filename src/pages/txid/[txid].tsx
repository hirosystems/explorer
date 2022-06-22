import * as React from 'react';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';

import { getContractId, removeKeysWithUndefinedValues } from '@common/utils';
import { useRefreshOnBack } from '../../hooks/use-refresh-on-back';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork, selectActiveNetworkUrl } from '@common/state/network-slice';
import { wrapper } from '@common/state/store';
import { Meta } from '@components/meta-head';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { TxNotFound } from '@components/tx-not-found';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { InView } from '@store/currently-in-view';
import { ServerResponse } from 'http';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';

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

  const { query } = useRouter();
  const txid = query.txid as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const queries = getTransactionQueries(networkUrl);

  const queryOptions = {
    staleTime: 2000,
  };

  const { data: txData } = useQuery(
    transactionQK(TransactionQueryKeys.transaction, txid),
    queries.fetchTransaction(txid),
    queryOptions
  );

  const contractId = txData && getContractId(txid, txData.transaction);

  useRefreshOnBack('txid');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const noop = () => {};

  useQuery(
    contractId ? transactionQK(TransactionQueryKeys.mempoolTransactionsForAddress, contractId) : '',
    contractId ? queries.fetchMempoolTransactionsForAddress(contractId) : noop,
    { ...queryOptions, ...{ enabled: !!contractId } }
  );
  useQuery(
    contractId ? transactionQK(TransactionQueryKeys.transactionsForAddress, contractId) : '',
    contractId ? queries.fetchTransactionsForAddress(contractId) : noop,
    { ...queryOptions, ...{ enabled: !!contractId } }
  );
  useQuery(
    contractId ? transactionQK(TransactionQueryKeys.contract, contractId) : '',
    contractId ? queries.fetchContract(contractId) : noop,
    { ...queryOptions, ...{ enabled: !!contractId } }
  );

  useQuery(
    contractId ? transactionQK(TransactionQueryKeys.accountBalance, contractId) : '',
    contractId ? queries.fetchAccountBalance(contractId) : noop,
    { ...queryOptions, ...{ enabled: !!contractId } }
  );

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
  const prefetchOptions = { retry: 0, staleTime: 5000 };
  const queries = getTransactionQueries(networkUrl);
  try {
    await queryClient.fetchQuery(
      transactionQK(TransactionQueryKeys.transaction, txPageQuery),
      queries.fetchTransaction(txPageQuery),
      prefetchOptions
    );
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

  const dehydratedState = removeKeysWithUndefinedValues(dehydrate(client));
  return {
    props: {
      isHome: false,
      dehydratedState,
    },
  };
});

export default TransactionPage;
