import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthOptions } from '@stacks/connect/dist/types/types/auth';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { useApi } from '@/common/api/client';
import { useGlobalContext } from '@/common/context/useAppContext';
import { useAppDispatch, useAppSelector } from '@/common/state/hooks';
import { useAddressQueries } from '@/features/address/use-address-queries';
import { transactionQK, TransactionQueryKeys } from '@/features/transaction/query-keys';

import { useInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { useAddressMempoolTxsInfinite } from '../../common/queries/useAddressMempoolTxsInfinite';
import {
  connect,
  disconnect,
  selectUserData,
  selectUserSession,
  setUserData,
} from '../sandbox-slice';

export const useUser = () => {
  const api = useApi();
  const dispatch = useAppDispatch();
  const activeNetworkMode = useGlobalContext().activeNetwork.mode;
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

  const confirmedTxsResponse = useAddressConfirmedTxsWithTransfersInfinite(api, {
    address: stxAddress,
  });

  const mempoolTxsResponse = useAddressMempoolTxsInfinite(api, { address: stxAddress });

  const { data: balance } = useQuery(
    transactionQK(TransactionQueryKeys.accountBalance, stxAddress),
    () => queries.fetchAccountBalance(stxAddress)(),
    { enabled: !!stxAddress }
  );

  const transactionsWithTransfers =
    useInfiniteQueryResult<AddressTransactionWithTransfers>(confirmedTxsResponse);
  const transactions = useMemo(
    () => transactionsWithTransfers.map(tx => tx.tx),
    [transactionsWithTransfers]
  );
  const mempoolTransactions = useInfiniteQueryResult<MempoolTransaction>(mempoolTxsResponse);

  return {
    isConnected,
    userData,
    stxAddress,
    transactions,
    mempoolTransactions,
    balance,
    userSession,
    refetchTransactions: confirmedTxsResponse.refetch,
    refetchMempoolTransactions: mempoolTxsResponse.refetch,
    hasTransactions: !!transactions.length || !!mempoolTransactions.length,
    connect: (authOptions?: Partial<AuthOptions>) =>
      dispatch(connect({ activeNetworkMode, authOptions })),
    disconnect: () => dispatch(disconnect()),
    isFetching: confirmedTxsResponse.isFetching || mempoolTxsResponse.isFetching || !mounted,
  };
};
