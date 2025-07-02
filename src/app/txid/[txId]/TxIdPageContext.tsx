'use client';

import { ReactNode, createContext, useContext } from 'react';

interface TxIdPageDataContextType {
  stxPrice: number;
}

const DEFAULT_TX_ID_PAGE_DATA: TxIdPageDataContextType = {
  stxPrice: 0,
};

const TxIdPageDataContext = createContext<TxIdPageDataContextType>(DEFAULT_TX_ID_PAGE_DATA);

interface TxIdPageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
}

export function TxIdPageDataProvider({
  children,
  stxPrice = DEFAULT_TX_ID_PAGE_DATA.stxPrice,
}: TxIdPageDataProviderProps) {
  const contextValue = {
    stxPrice,
  };

  return (
    <TxIdPageDataContext.Provider value={contextValue}>{children}</TxIdPageDataContext.Provider>
  );
}

export function useTxIdPageData() {
  return useContext(TxIdPageDataContext);
}
