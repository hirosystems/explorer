import { apiClientsState } from '@store/api-clients';
import { atomFamilyWithQuery } from '@store/query';

import type { AccountDataResponse } from '@stacks/stacks-blockchain-api-types';
import type { Getter } from 'jotai';
import type { TransactionsListResponse } from '@store/transactions';

// ----------------
// keys
// ----------------
export enum AccountsQueryKeys {
  ACCOUNT_INFO = 'accounts/ACCOUNT_INFO',
  ACCOUNT_TRANSACTIONS = 'accounts/ACCOUNT_TRANSACTIONS',
}

export function makeAccountInfoKey(txId: string) {
  return [AccountsQueryKeys.ACCOUNT_INFO, txId];
}

// ----------------
// types
// ----------------

// ----------------
// queryFn's
// ----------------
const accountInfoQueryFn = async (get: Getter, principal: string) => {
  const { accountsApi } = get(apiClientsState);
  return accountsApi.getAccountInfo({
    principal,
    proof: 0,
  });
};
const accountTransactionsQueryFn = async (get: Getter, principal: string) => {
  const { accountsApi } = get(apiClientsState);
  return (await accountsApi.getAccountTransactions({
    principal,
    limit: 50,
  })) as TransactionsListResponse;
};

// ----------------
// atoms
// ----------------
export const accountInfoState = atomFamilyWithQuery<string, AccountDataResponse>(
  AccountsQueryKeys.ACCOUNT_INFO,
  accountInfoQueryFn
);

export const accountTransactionsState = atomFamilyWithQuery<string, TransactionsListResponse>(
  AccountsQueryKeys.ACCOUNT_TRANSACTIONS,
  accountTransactionsQueryFn
);
