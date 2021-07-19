import type { GetQueries, Queries } from 'jotai-query-toolkit/nextjs';
import { queryWith0x } from '@common/utils';
import { getApiClients } from '@common/api/client';
import { getBlocksQueryKey } from '@store/blocks';
import { NextPageContext } from 'next';
import { QueryClient } from 'react-query';
import { getSingleCachedQueryData } from 'jotai-query-toolkit/nextjs';
import { getTxQueryKey } from '@store/transactions';
import type { Block } from '@stacks/stacks-blockchain-api-types';
import { getMicroblocksQueryKey } from '@store/microblocks';

export function getBlockHashFromCtx(ctx: NextPageContext) {
  const { query } = ctx;
  if (!query?.hash) throw Error('No block hash');
  return queryWith0x(query?.hash?.toString());
}

// this will get us our query props data from the react-query cache if it exists
// to prevent duplicate fetching when we don't always need to :)
function getBlockPageCachedQueryProps(ctx: NextPageContext, queryClient: QueryClient) {
  const blockHash = getBlockHashFromCtx(ctx);
  const queryKey = getBlocksQueryKey.single(blockHash);
  return getSingleCachedQueryData<Block>(queryKey, queryClient);
}

// this is our function for fetching the transaction being requested
// the transaction (if found) will be fed as context/props to the getQuerys function
// so our other queries can depend on it
export const getBlockPageQueryProps = async (
  ctx: NextPageContext,
  queryClient: QueryClient
): Promise<Block> => {
  const blockHash = getBlockHashFromCtx(ctx);
  const cachedBlock =
    // we can use react-query to get the data if it's been viewed before,
    // and on mount it will automatically revalidate and update if it's different
    getBlockPageCachedQueryProps(ctx, queryClient);
  if (cachedBlock) return cachedBlock;
  const { blocksApi } = await getApiClients(ctx);
  return (await blocksApi.getBlockByHash({
    hash: blockHash,
  })) as Block;
};

export const getBlockPageQueries: GetQueries<Block> = async (ctx, queryProps, queryClient) => {
  const blockHash = getBlockHashFromCtx(ctx);
  const { transactionsApi, microblocksApi } = await getApiClients(ctx);
  const txQueries: Queries<Block> =
    queryProps?.txs.map(txid => {
      const queryKey = getTxQueryKey.single(txid);
      return [
        queryKey,
        () => {
          const cached = queryClient && getSingleCachedQueryData(queryKey, queryClient);
          if (cached) return cached;
          return transactionsApi.getTransactionById({ txId: txid });
        },
      ];
    }) || [];

  const microblockQueries: Queries<Block> =
    queryProps?.microblocks_accepted?.map(microblockHash => {
      const queryKey = getMicroblocksQueryKey.single(microblockHash);
      return [
        queryKey,
        () => {
          const cached = queryClient && getSingleCachedQueryData(queryKey, queryClient);
          if (cached) return cached;
          return microblocksApi.getMicroblockByHash({ hash: microblockHash });
        },
      ];
    }) || [];

  return [
    [getBlocksQueryKey.single(blockHash), () => queryProps],
    ...txQueries,
    ...microblockQueries,
  ];
};
