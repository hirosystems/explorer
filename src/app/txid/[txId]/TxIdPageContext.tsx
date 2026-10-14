'use client';

import { TxDetails, TxEventListResponse } from '@/common/types/tx-v3';
import { ReactNode, createContext, useContext } from 'react';

import { TxIdPageFilters } from './page';

interface TxIdPageDataContextType {
  stxPrice: number;
  initialTxData?: TxDetails;
  /** The first page of a contract call's events, when it holds all of them (see Tokens Transferred). */
  initialTxEvents?: TxEventListResponse;
  txId: string;
  filters: TxIdPageFilters;
  numFunctions?: number;
}

const DEFAULT_TX_ID_PAGE_DATA: TxIdPageDataContextType = {
  stxPrice: 0,
  initialTxData: undefined,
  txId: '',
  filters: {
    fromAddress: '',
    toAddress: '',
    startTime: '',
    endTime: '',
    transactionType: [],
  },
};

const TxIdPageDataContext = createContext<TxIdPageDataContextType>(DEFAULT_TX_ID_PAGE_DATA);

interface TxIdPageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
  initialTxData?: TxDetails;
  initialTxEvents?: TxEventListResponse;
  txId: string;
  filters: TxIdPageFilters;
  numFunctions?: number;
}

export function TxIdPageDataProvider({
  children,
  stxPrice = DEFAULT_TX_ID_PAGE_DATA.stxPrice,
  initialTxData,
  initialTxEvents,
  txId,
  filters,
  numFunctions,
}: TxIdPageDataProviderProps) {
  const contextValue = {
    stxPrice,
    initialTxData,
    initialTxEvents,
    txId,
    filters,
    numFunctions,
  };

  return (
    <TxIdPageDataContext.Provider value={contextValue}>{children}</TxIdPageDataContext.Provider>
  );
}

export function useTxIdPageData() {
  return useContext(TxIdPageDataContext);
}
