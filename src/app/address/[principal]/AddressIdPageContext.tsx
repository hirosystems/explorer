'use client';

import { ReactNode, createContext, useContext } from 'react';

import {
  AddressBalanceResponse,
  AddressNonces,
  BnsNamesOwnByAddressResponse,
} from '@stacks/stacks-blockchain-api-types';

interface AddressIdPageDataContextType {
  stxPrice: number;
  btcPrice: number;
  initialAddressBalancesData?: AddressBalanceResponse;
  initialAddressLatestNonceData?: AddressNonces;
  initialAddressBNSNamesData?: BnsNamesOwnByAddressResponse;
  principal: string;
}

const DEFAULT_ADDRESS_ID_PAGE_DATA: AddressIdPageDataContextType = {
  stxPrice: 0,
  btcPrice: 0,
  initialAddressBalancesData: undefined,
  initialAddressLatestNonceData: undefined,
  initialAddressBNSNamesData: undefined,
  principal: '',
};

const AddressIdPageDataContext = createContext<AddressIdPageDataContextType>(
  DEFAULT_ADDRESS_ID_PAGE_DATA
);

interface AddressIdPageDataProviderProps {
  children: ReactNode;
  stxPrice?: number;
  btcPrice?: number;
  initialAddressBalancesData?: AddressBalanceResponse;
  initialAddressLatestNonceData?: AddressNonces;
  initialAddressBNSNamesData?: BnsNamesOwnByAddressResponse;
  principal: string;
}

export function AddressIdPageDataProvider({
  children,
  stxPrice = DEFAULT_ADDRESS_ID_PAGE_DATA.stxPrice,
  btcPrice = DEFAULT_ADDRESS_ID_PAGE_DATA.btcPrice,
  initialAddressBalancesData,
  initialAddressLatestNonceData,
  initialAddressBNSNamesData,
  principal,
}: AddressIdPageDataProviderProps) {
  const contextValue = {
    stxPrice,
    btcPrice,
    initialAddressBalancesData,
    initialAddressLatestNonceData,
    initialAddressBNSNamesData,
    principal,
  };

  return (
    <AddressIdPageDataContext.Provider value={contextValue}>
      {children}
    </AddressIdPageDataContext.Provider>
  );
}

export function useAddressIdPageData() {
  return useContext(AddressIdPageDataContext);
}
