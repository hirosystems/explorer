import { GetQueries } from 'jotai-query-toolkit/nextjs';
import { getApiClients } from '@common/api/client';
import { getTxQueryKey, TransactionsListResponse } from '@store/transactions';
import { DEFAULT_BLOCKS_LIST_LIMIT, DEFAULT_LIST_LIMIT_SMALL } from '@common/constants';
import { BlocksListResponse, getBlocksQueryKey } from '@store/blocks';
import { DEFAULT_TX_FILTER_TYPES } from '@store/recoil/filter';

export const getHomePageQueries: GetQueries = async ctx => {
  const { transactionsApi, blocksApi } = await getApiClients();
  return [
    [
      getTxQueryKey.confirmed(DEFAULT_LIST_LIMIT_SMALL, DEFAULT_TX_FILTER_TYPES),
      async () => {
        return (await transactionsApi.getTransactionList({
          limit: DEFAULT_LIST_LIMIT_SMALL,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
    [
      getTxQueryKey.mempool(DEFAULT_LIST_LIMIT_SMALL),
      async () => {
        return (await transactionsApi.getMempoolTransactionList({
          limit: DEFAULT_LIST_LIMIT_SMALL,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
    [
      getBlocksQueryKey.confirmed(DEFAULT_BLOCKS_LIST_LIMIT),
      async () => {
        return (await blocksApi.getBlockList({
          limit: DEFAULT_BLOCKS_LIST_LIMIT,
          offset: 0,
        })) as BlocksListResponse;
      },
    ],
  ];
};
