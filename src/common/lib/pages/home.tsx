import type { NextPageContext } from 'next';
import { fetchBlocksList } from '@common/api/blocks';
import { getServerSideApiServer } from '@common/api/utils';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { HOMEPAGE_TX_LIST_CONFIRMED, HOMEPAGE_TX_LIST_MEMPOOL } from '@common/constants/data';
import { preloadTransactionsListData } from '@common/lib/transactions';
import devalue from 'devalue';

export async function getSsrHomeProps(context: NextPageContext) {
  const apiServer = await getServerSideApiServer(context);
  const queryClient = new QueryClient();
  const [blocks] = await Promise.all([
    fetchBlocksList({
      apiServer,
      limit: 10,
    })(),
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

  return { blocks, dehydratedState };
}
