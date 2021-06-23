import { atomFamily, atomWithDefault } from 'jotai/utils';
import deepEqual from 'fast-deep-equal';
import { apiClientsState } from '@store/api-clients';
import { atomFamilyWithQuery, atomWithQuery } from '@store/query';

import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import type { ApiResponseWithResultsOffset } from '@common/types/api';

const paginatedResponseOffset = atomFamily(_key => atomWithDefault(() => 0), deepEqual);

// ----------------
// keys
// ----------------
export enum TransactionQueryKeys {
  CONFIRMED = 'transactions/CONFIRMED',
  MEMPOOL = 'transactions/MEMPOOL',
  SINGLE = 'transactions/SINGLE',
}

export function makeTransactionSingleKey(txId: string) {
  return [TransactionQueryKeys.SINGLE, txId];
}

// ----------------
// types
// ----------------
export type TransactionsListResponse = ApiResponseWithResultsOffset<Transaction>;
export type MempoolTransactionsListResponse = ApiResponseWithResultsOffset<MempoolTransaction>;

// ----------------
// queryFn's
// ----------------
const transactionsListQueryFn = async (get: Getter) => {
  const { transactionsApi } = get(apiClientsState);
  const offset = get(paginatedResponseOffset([TransactionQueryKeys.CONFIRMED, 'offset']));
  return (await transactionsApi.getTransactionList({
    offset,
  })) as TransactionsListResponse; // cast due to limitation in api client
};
const mempoolTransactionsListQueryFn = async (get: Getter) => {
  const { transactionsApi } = get(apiClientsState);
  const offset = get(paginatedResponseOffset([TransactionQueryKeys.MEMPOOL, 'offset']));
  return (await transactionsApi.getMempoolTransactionList({
    offset,
  })) as MempoolTransactionsListResponse; // cast due to limitation in api client
};
const transactionSingeQueryFn = async (get: Getter, txId: string) => {
  const { transactionsApi } = get(apiClientsState);
  return (await transactionsApi.getTransactionById({
    txId,
  })) as MempoolTransaction | Transaction;
};

// ----------------
// atoms
// ----------------
export const transactionsListState = atomWithQuery<TransactionsListResponse>(
  TransactionQueryKeys.CONFIRMED,
  transactionsListQueryFn,
  { equalityFn: (a, b) => a.results[0].tx_id === b.results[0].tx_id }
);

export const mempoolTransactionsListState = atomWithQuery<MempoolTransactionsListResponse>(
  TransactionQueryKeys.MEMPOOL,
  mempoolTransactionsListQueryFn,
  { equalityFn: (a, b) => a.results[0].tx_id === b.results[0].tx_id }
);

export const transactionSingleState = atomFamilyWithQuery<string, MempoolTransaction | Transaction>(
  TransactionQueryKeys.SINGLE,
  transactionSingeQueryFn
);
