import * as React from 'react';

import { useAuthState } from '@sandbox/hooks/use-auth';
import useSWR from 'swr';
import { useApiServer } from '@common/hooks/use-api';
import { fetchAllAccountData } from '@common/api/accounts';
import { UserData } from '@stacks/auth';
import {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';
import { useNetworkMode } from '@common/hooks/use-network-mode';

interface AccountDataResponse {
  balances: AddressBalanceResponse;
  transactions: TransactionResults;
  pendingTransactions: MempoolTransaction[] | [];
}

const useFetchAccountData = (
  principal: string,
  options?: {
    suspense?: boolean;
  }
) => {
  const apiServer = useApiServer();

  const fetcher = async (principal: string): Promise<AccountDataResponse> =>
    fetchAllAccountData(apiServer)({ principal }) as Promise<AccountDataResponse>;

  const data = useSWR<AccountDataResponse>(principal, fetcher, {
    suspense: options?.suspense,
  });

  return data;
};

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
  const networkMode = useNetworkMode();

  const principal = networkMode && userData?.profile?.stxAddress?.[networkMode];
  const username = userData?.username;
  const profile = userData?.profile;

  const { data, mutate } = useFetchAccountData(principal, options);

  const hasTransactions = !!(
    data?.transactions?.results?.length || data?.pendingTransactions?.length
  );
  return {
    principal,
    username,
    profile,
    transactions: data?.transactions?.results,
    balances: data?.balances,
    pendingTransactions: data?.pendingTransactions,
    refreshPendingTransactions: mutate,
    hasTransactions,
    ...userData,
  };
};
