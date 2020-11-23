import * as React from 'react';

import { useAuthState } from '@common/hooks/use-auth';
import useSWR from 'swr';
import { useApiServer } from '@common/hooks/use-api';
import { fetchAllAccountData } from '@common/api/accounts';
import { UserData } from '@stacks/auth';
import {
  AddressBalanceResponse,
  MempoolTransaction,
  TransactionResults,
} from '@blockstack/stacks-blockchain-api-types';

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
    fetchAllAccountData(apiServer)(principal);

  const data = useSWR<AccountDataResponse>(principal, fetcher, {
    // refreshInterval: 2500,
    suspense: options?.suspense,
  });

  return data;
};

export const useUser = (options?: {
  suspense?: boolean;
}): {
  principal?: string;
  username?: string;
  profile: UserData['profile'];
  transactions?: TransactionResults['results'];
  balances?: AddressBalanceResponse;
  pendingTransactions?: MempoolTransaction[];
  refreshPendingTransactions?: () => void;
  hasTransactions?: boolean;
} => {
  const { userData } = useAuthState();

  const principal = userData?.profile?.stxAddress;
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
  };
};
