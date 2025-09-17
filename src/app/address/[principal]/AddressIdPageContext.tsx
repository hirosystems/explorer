'use client';

import { CompressedPoxInfo } from '@/app/address/[principal]/page-data';
import { ReactNode, createContext, useContext } from 'react';

import {
  AddressBalanceResponse,
  AddressNonces,
  AddressTransaction,
  BnsNamesOwnByAddressResponse,
  BurnchainRewardsTotal,
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { GenericResponseType } from '@/common/hooks/useInfiniteQueryResult';
import { CompressedTxAndMempoolTxTableData } from '@/app/transactions/utils';

interface AddressIdPageDataContextType {
  stxPrice: number;
  btcPrice: number;
  initialAddressBalancesData?: AddressBalanceResponse;
  initialAddressLatestNonceData?: AddressNonces;
  initialAddressBNSNamesData?: BnsNamesOwnByAddressResponse;
  initialBurnChainRewardsData?: BurnchainRewardsTotal;
  initialAddressRecentTransactionsData?: (CompressedTxAndMempoolTxTableData)[];
  initialPoxInfoData?: CompressedPoxInfo;
  principal: string;
}

const DEFAULT_ADDRESS_ID_PAGE_DATA: AddressIdPageDataContextType = {
  stxPrice: 0,
  btcPrice: 0,
  initialAddressBalancesData: undefined,
  initialAddressLatestNonceData: undefined,
  initialAddressBNSNamesData: undefined,
  initialBurnChainRewardsData: undefined,
  initialAddressRecentTransactionsData: undefined,
  initialPoxInfoData: undefined,
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
  initialBurnChainRewardsData?: BurnchainRewardsTotal;
  initialPoxInfoData?: CompressedPoxInfo;
  initialAddressRecentTransactionsData?: GenericResponseType<CompressedTxAndMempoolTxTableData>;
  principal: string;
}

export function AddressIdPageDataProvider({
  children,
  stxPrice = DEFAULT_ADDRESS_ID_PAGE_DATA.stxPrice,
  btcPrice = DEFAULT_ADDRESS_ID_PAGE_DATA.btcPrice,
  initialAddressBalancesData,
  initialAddressLatestNonceData,
  initialAddressBNSNamesData,
  initialBurnChainRewardsData,
  initialPoxInfoData,
  initialAddressRecentTransactionsData,
  principal,
}: AddressIdPageDataProviderProps) {
  const contextValue = {
    stxPrice,
    btcPrice,
    initialAddressBalancesData,
    initialAddressLatestNonceData,
    initialAddressBNSNamesData,
    initialBurnChainRewardsData,
    initialPoxInfoData,
    initialAddressRecentTransactionsData,
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
