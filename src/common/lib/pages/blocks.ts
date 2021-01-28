import type { NextPageContext } from 'next';
import { getServerSideApiServer } from '@common/api/utils';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { BLOCKS_PAGE_BLOCKS_LIST, BLOCKS_PAGE_BLOCKS_LIST_LIMIT } from '@common/constants/data';
import { preloadBlocksList } from '@common/lib/blocks';
import devalue from 'devalue';

export async function getSsrBlocksProps(context: NextPageContext): Promise<string> {
  const apiServer = await getServerSideApiServer(context);
  const queryClient = new QueryClient();
  await preloadBlocksList({
    apiServer,
    queryClient,
    options: {
      limit: BLOCKS_PAGE_BLOCKS_LIST_LIMIT,
      key: BLOCKS_PAGE_BLOCKS_LIST,
    },
  });
  const dehydratedState = devalue(dehydrate(queryClient));

  return dehydratedState;
}
