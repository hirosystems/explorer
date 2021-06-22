import type { NextPageContext } from 'next';
import { getServerSideApiServer } from '@common/api/utils';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import {
  TRANSACTIONS_PAGE_TX_LIST_CONFIRMED,
  TRANSACTIONS_PAGE_TX_LIST_MEMPOOL,
} from '@common/constants/data';
import { preloadTransactionsListData } from '@common/lib/transactions';
import devalue from 'devalue';
import { DEFAULT_TX_FILTER_TYPES } from '@store/recoil/filter';

export async function prefetchTransactionsPageData(context: NextPageContext) {
  const apiServer = await getServerSideApiServer(context);
  const queryClient = new QueryClient();
  const limit = 50;
  await Promise.all([
    preloadTransactionsListData({
      apiServer,
      queryClient,
      options: {
        limit: limit,
        key: TRANSACTIONS_PAGE_TX_LIST_CONFIRMED,
        txTypes: DEFAULT_TX_FILTER_TYPES,
      },
    }),
    preloadTransactionsListData({
      apiServer,
      queryClient,
      options: {
        limit: limit,
        mempool: true,
        key: TRANSACTIONS_PAGE_TX_LIST_MEMPOOL,
        txTypes: DEFAULT_TX_FILTER_TYPES,
      },
    }),
  ]);

  const dehydratedState = devalue(dehydrate(queryClient));

  return { dehydratedState };
}
