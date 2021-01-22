import type { NextPageContext } from 'next';
import { getServerSideApiServer } from '@common/api/utils';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import {
  HOMEPAGE_BLOCKS_LIST,
  HOMEPAGE_TX_LIST_CONFIRMED,
  HOMEPAGE_TX_LIST_MEMPOOL,
} from '@common/constants/data';
import { preloadTransactionsListData } from '@common/lib/transactions';
import { preloadBlocksList } from '@common/lib/blocks';
import devalue from 'devalue';

export async function getSsrHomeProps(
  context: NextPageContext
): Promise<{ dehydratedState: string }> {
  const apiServer = await getServerSideApiServer(context);
  const queryClient = new QueryClient();
  await Promise.all([
    preloadBlocksList({
      apiServer,
      queryClient,
      options: {
        limit: 10,
        key: HOMEPAGE_BLOCKS_LIST,
      },
    }),
    preloadTransactionsListData({
      apiServer,
      queryClient,
      options: {
        limit: 10,
        key: HOMEPAGE_TX_LIST_CONFIRMED,
      },
    }),
    preloadTransactionsListData({
      apiServer,
      queryClient,
      options: {
        limit: 10,
        mempool: true,
        key: HOMEPAGE_TX_LIST_MEMPOOL,
      },
    }),
  ]);

  const dehydratedState = devalue(dehydrate(queryClient));

  return { dehydratedState };
}
