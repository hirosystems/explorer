import { useQueries } from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useGetBlocksByBurnBlockQuery } from '../../../../common/queries/useBlocksByBurnBlock';

export function useStxBlocksForBtcBlocks(btcBlocks: BurnBlock[]) {
  const getQuery = useGetBlocksByBurnBlockQuery();

  const stxBlockQueries = btcBlocks.map(btcBlock => {
    return getQuery(btcBlock.burn_block_height);
  });

  const stxBlocksResults = useQueries({ queries: stxBlockQueries });

  const stxBlocks = stxBlocksResults.flatMap(
    result => result.data?.results || (result.data as any)?.pages[0].results || []
  );

  return stxBlocks;
}
