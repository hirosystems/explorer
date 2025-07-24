'use client';

import { ReactNode, createContext, useContext } from 'react';

import { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

interface TxIdPageDataContextType {
  stxPrice: number;
  initialTxData?: Transaction | MempoolTransaction;
  txId: string;
}

const DEFAULT_TX_ID_PAGE_DATA: TxIdPageDataContextType = {
  stxPrice: 0,
  initialTxData: undefined,
  txId: '',
};

const TxIdPageDataContext = createContext<TxIdPageDataContextType>(DEFAULT_TX_ID_PAGE_DATA);

interface TxIdPageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
  initialTxData?: Transaction | MempoolTransaction;
  txId: string;
}

export function TxIdPageDataProvider({
  children,
  stxPrice = DEFAULT_TX_ID_PAGE_DATA.stxPrice,
  initialTxData,
  txId,
}: TxIdPageDataProviderProps) {
  const contextValue = {
    stxPrice,
    initialTxData,
    txId,
  };

  return (
    <TxIdPageDataContext.Provider value={contextValue}>{children}</TxIdPageDataContext.Provider>
  );
}

export function useTxIdPageData() {
  return useContext(TxIdPageDataContext);
}
