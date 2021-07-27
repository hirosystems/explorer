import { GetQueries } from 'jotai-query-toolkit/nextjs';
import { getApiClients } from '@common/api/client';
import { getTxQueryKey, TransactionsListResponse } from '@store/transactions';
import { DEFAULT_LIST_LIMIT } from '@common/constants';
import { DEFAULT_TX_FILTER_TYPES } from '@store/recoil/filter';

export const getTransactionsPageQueries: GetQueries = async ctx => {
  const { transactionsApi } = await getApiClients(ctx);
  return [
    [
      getTxQueryKey.confirmed(DEFAULT_LIST_LIMIT, DEFAULT_TX_FILTER_TYPES),
      async () => {
        return (await transactionsApi.getTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
          type: DEFAULT_TX_FILTER_TYPES,
        })) as TransactionsListResponse;
      },
    ],
    [
      getTxQueryKey.mempool(DEFAULT_LIST_LIMIT),
      async () => {
        return (await transactionsApi.getMempoolTransactionList({
          limit: DEFAULT_LIST_LIMIT,
          offset: 0,
        })) as TransactionsListResponse;
      },
    ],
  ];
};
