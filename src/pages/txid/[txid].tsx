import * as React from 'react';
import { TransactionMeta } from '@components/meta/transactions';
import { TransactionPageComponent } from '@components/transaction-page-component';

import { getContractId } from '@common/utils';

import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { Meta } from '@components/meta-head';
import { UnlockingScheduleModal } from '@components/modals/unlocking-schedule';
import { TxNotFound } from '@components/tx-not-found';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import { getTransactionQueries } from '@features/transaction/use-transaction-queries';
import { InView } from '@store/currently-in-view';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

interface TransactionPageProps {
  inView: InView;
  isPossiblyValid?: boolean;
  error?: boolean;
}

const TransactionPage: NextPage<TransactionPageProps> = ({ error, isPossiblyValid }) => {
  const { query } = useRouter();
  const txid = query.txid as string;
  const networkUrl = useAppSelector(selectActiveNetwork).url;
  const queries = getTransactionQueries(networkUrl);

  const queryOptions = {
    staleTime: 2000,
  };

  const { data: tx } = useQuery(
    transactionQK(TransactionQueryKeys.transaction, txid),
    queries.fetchSingleTransaction(txid),
    queryOptions
  );

  const contractId = tx && getContractId(txid, tx);

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

  if (error)
    return (
      <>
        <Meta title="Transaction not found" />
        <TxNotFound isPending={isPossiblyValid} />
      </>
    );

  return (
    <>
      <UnlockingScheduleModal />
      <TransactionMeta />
      <TransactionPageComponent />
    </>
  );
};

export default TransactionPage;
