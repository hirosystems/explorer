import {
  AddressBalanceResponse,
  MempoolTransactionListResponse,
  NonFungibleTokenHoldingsList,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';
import { apiClients, createConfig } from '@/common/api/client';
import { DEFAULT_LIST_LIMIT } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';
import { ApiResponseWithResultsOffset } from '@/common/types/api';

export const getAddressQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));
  return {
    fetchCoreApiInfo: () => () => {
      return clients.infoApi.getCoreApiInfo();
    },
    fetchAccountBalance: (address: string) => () => {
      return clients.accountsApi.getAccountBalance({
        principal: address,
      }) as unknown as AddressBalanceResponse; // missing API type
    },
    fetchNftHoldings: (address: string) => () => {
      return clients.nonFungibleTokensApi.getNftHoldings({
        principal: address,
        limit: 200,
      }) as unknown as NonFungibleTokenHoldingsList; // missing API type
    },
    fetchAccountInfo: (address: string) => () => {
      return clients.accountsApi.getAccountInfo({ principal: address });
    },
    fetchTransactionsForAddress:
      (address: string, limit = DEFAULT_LIST_LIMIT, offset = 0) =>
      () => {
        return clients.accountsApi.getAccountTransactions({
          principal: address,
          offset,
          limit,
        }) as unknown as ApiResponseWithResultsOffset<Transaction>; // missing API type
      },
    fetchMempoolTransactionsForAddress:
      (address: string, limit = DEFAULT_LIST_LIMIT, offset = 0) =>
      () => {
        return clients.transactionsApi.getMempoolTransactionList({
          address,
          offset,
          limit,
        }) as unknown as MempoolTransactionListResponse; // missing API type
      },
  };
};

export const useAddressQueries = () => {
  const network = useGlobalContext().activeNetwork;
  return getAddressQueries(network.url);
};
