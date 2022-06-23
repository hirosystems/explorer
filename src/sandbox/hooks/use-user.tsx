import * as React from 'react';
import { useAuthState } from '@sandbox/hooks/use-auth';
import { UserData } from '@stacks/auth';
import type {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@stacks/stacks-blockchain-api-types';
import { useAtomValue } from 'jotai/utils';
import {
  accountBalancesResponseState,
  accountPendingTransactionsState,
  accountTransactionsState,
} from '@store/accounts';
import { DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const useUser = (options?: {
  suspense?: boolean;
}): {
  principal?: string;
  transactions?: TransactionResults['results'];
  balances?: AddressBalanceResponse;
  pendingTransactions?: MempoolTransaction[];
  refreshPendingTransactions?: () => void;
  hasTransactions?: boolean;
} & Partial<UserData> => {
  const { userData } = useAuthState();
  const networkMode = useAppSelector(selectActiveNetwork).mode;

  const principal = networkMode && userData?.profile?.stxAddress?.[networkMode];
  const profile = userData?.profile;

  const balances = useAtomValue(accountBalancesResponseState(principal));
  const transactions = useAtomValue(
    accountTransactionsState([principal, DEFAULT_LIST_LIMIT_SMALL])
  );
  const pendingTransactions = useAtomValue(
    accountPendingTransactionsState([principal, DEFAULT_LIST_LIMIT_SMALL])
  );

  const hasTransactions = !!(
    (transactions && transactions?.pages?.[0].total > 0) ||
    (pendingTransactions && pendingTransactions?.pages?.[0]?.results?.length > 0)
  );
  return {
    principal,
    profile,
    transactions: transactions?.pages?.[0].results as TransactionResults['results'],
    balances,
    pendingTransactions: pendingTransactions && pendingTransactions?.pages?.[0].results,
    hasTransactions,
    ...userData,
  };
};
