import { apiClients, createConfig } from '@common/api/client';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { BlocksListResponse } from '@store/blocks';
import { TransactionsListResponse } from '@store/transactions';
import { useAppSelector } from '@common/state/hooks';
import { selectActiveNetwork } from '@common/state/network-slice';

export const getHomeQueries = (networkUrl: string) => {
  const clients = apiClients(createConfig(networkUrl));
  return {
    fetchBlocks:
      (limit = DEFAULT_BLOCKS_LIST_LIMIT, offset = 0) =>
      () =>
        clients.blocksApi.getBlockList({
          limit,
          offset,
        }) as unknown as BlocksListResponse,
    fetchConfirmedTransactions:
      (limit = DEFAULT_LIST_LIMIT_SMALL, offset = 0) =>
      () =>
        clients.transactionsApi.getTransactionList({
          limit,
          offset,
        }) as unknown as TransactionsListResponse,
    fetchMempoolTransactions:
      (limit = DEFAULT_LIST_LIMIT_SMALL, offset = 0) =>
      () =>
        clients.transactionsApi.getMempoolTransactionList({
          limit,
          offset,
        }) as unknown as TransactionsListResponse,
  };
};

export const useHomeQueries = () => {
  const network = useAppSelector(selectActiveNetwork);
  return getHomeQueries(network.url);
};
