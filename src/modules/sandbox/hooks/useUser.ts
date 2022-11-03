import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';
import { useAddressQueries } from '@features/address/use-address-queries';
import { useQuery } from 'react-query';
import { transactionQK, TransactionQueryKeys } from '@features/transaction/query-keys';
import {
  connect,
  disconnect,
  selectUserData,
  selectUserSession,
  setUserData,
} from '@modules/sandbox/sandbox-slice';
import { AuthOptions } from '@stacks/connect/dist/types/types/auth';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const activeNetworkMode = useAppSelector(selectActiveNetwork).mode;
  const userSession = useAppSelector(selectUserSession);
  const userData = useAppSelector(selectUserData);
  const [mounted, setMounted] = useState(false);
  const queries = useAddressQueries();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      dispatch(setUserData({ userData: userSession.loadUserData() }));
    }
  }, []);

  const isConnected = mounted && !!userData;
  const stxAddress = userData?.profile?.stxAddress?.[activeNetworkMode];

  const { data: transactionsData, refetch: refetchTransactions } = useQuery(
    transactionQK(TransactionQueryKeys.transactionsForAddress, stxAddress),
    () => queries.fetchTransactionsForAddress(stxAddress, 10, 0)(),
    { enabled: !!stxAddress }
  );

  const { data: mempoolTransactionsData, refetch: refetchMempoolTransactions } = useQuery(
    transactionQK(TransactionQueryKeys.mempoolTransactionsForAddress, stxAddress),
    () => queries.fetchMempoolTransactionsForAddress(stxAddress, 10, 0)(),
    { enabled: !!stxAddress }
  );

  const { data: balance } = useQuery(
    transactionQK(TransactionQueryKeys.accountBalance, stxAddress),
    () => queries.fetchAccountBalance(stxAddress)(),
    { enabled: !!stxAddress }
  );

  return {
    isConnected,
    userData,
    stxAddress,
    transactions: transactionsData?.results,
    mempoolTransactions: mempoolTransactionsData?.results,
    balance,
    userSession,
    refetchTransactions,
    refetchMempoolTransactions,
    hasTransactions:
      !!transactionsData?.results?.length || !!mempoolTransactionsData?.results?.length,
    connect: (authOptions?: Partial<AuthOptions>) =>
      dispatch(connect({ activeNetworkMode: activeNetworkMode, authOptions: authOptions })),
    disconnect: () => dispatch(disconnect()),
  };
};
