import { apiClients, createConfig } from '@/common/api/client';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@/common/constants';
import { useGlobalContext } from '@/common/context/useAppContext';
import { ApiResponseWithResultsOffset } from '@/common/types/api';

import { Block, MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

export const getHomeQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));
  return {
    fetchBlocks:
      (limit = DEFAULT_BLOCKS_LIST_LIMIT, offset = 0) =>
      () =>
        clients.blocksApi.getBlockList({
          limit,
          offset,
        }) as unknown as ApiResponseWithResultsOffset<Block>,
    fetchConfirmedTransactions:
      (limit = DEFAULT_LIST_LIMIT_SMALL, offset = 0) =>
      () =>
        clients.transactionsApi.getTransactionList({
          limit,
          offset,
        }) as unknown as ApiResponseWithResultsOffset<Transaction>,
    fetchMempoolTransactions:
      (limit = DEFAULT_LIST_LIMIT_SMALL, offset = 0) =>
      () =>
        clients.transactionsApi.getMempoolTransactionList({
          limit,
          offset,
        }) as unknown as ApiResponseWithResultsOffset<MempoolTransaction>,
  };
};

export const useHomeQueries = () => {
  const network = useGlobalContext().activeNetwork;
  return getHomeQueries(network.url);
};
