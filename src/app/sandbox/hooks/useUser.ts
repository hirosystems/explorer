'use client';

import { useEffect, useMemo, useState } from 'react';

import { AuthOptions } from '@stacks/connect/dist/types/types/auth';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';

import { useGlobalContext } from '../../../common/context/useAppContext';
import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useAccountBalance } from '../../../common/queries/useAccountBalance';
import { useAddressConfirmedTxsWithTransfersInfinite } from '../../../common/queries/useAddressConfirmedTxsWithTransfersInfinite';
import { useAddressMempoolTxsInfinite } from '../../../common/queries/useAddressMempoolTxsInfinite';
import { useAppDispatch, useAppSelector } from '../../../common/state/hooks';
import {
  connect,
  disconnect,
  selectUserData,
  selectUserSession,
  setUserData,
} from '../sandbox-slice';

export function useUser() {
  const dispatch = useAppDispatch();
  const activeNetworkMode = useGlobalContext().activeNetwork.mode;
  const userSession = useAppSelector(selectUserSession);
  const userData = useAppSelector(selectUserData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      dispatch(setUserData({ userData: userSession.loadUserData() }));
    }
  }, []);

  const isConnected = mounted && !!userData;
  const stxAddress: string | undefined = userData?.profile?.stxAddress?.[activeNetworkMode];

  const confirmedTxsResponse = useAddressConfirmedTxsWithTransfersInfinite(stxAddress);

  const mempoolTxsResponse = useAddressMempoolTxsInfinite(stxAddress);

  const { data: balance } = useAccountBalance(stxAddress);

  const transactionsWithTransfers =
    useInfiniteQueryResult<AddressTransactionWithTransfers>(confirmedTxsResponse);
  const txs = useMemo(
    () => transactionsWithTransfers.map(tx => tx.tx),
    [transactionsWithTransfers]
  );
  const mempoolTransactions = useInfiniteQueryResult<MempoolTransaction>(mempoolTxsResponse);

  return {
    isConnected,
    userData,
    stxAddress,
    txs,
    mempoolTransactions,
    balance,
    userSession,
    refetchTransactions: confirmedTxsResponse.refetch,
    refetchMempoolTransactions: mempoolTxsResponse.refetch,
    hasTransactions: !!txs.length || !!mempoolTransactions.length,
    connect: (authOptions?: Partial<AuthOptions>) =>
      dispatch(connect({ activeNetworkMode: activeNetworkMode, authOptions: authOptions })),
    disconnect: () => dispatch(disconnect()),
  };
}
