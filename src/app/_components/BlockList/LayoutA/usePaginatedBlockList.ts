import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../../common/queries/useBlockListInfinite';
import { UIBlockType, UISingleBlock } from '../types';
import { useBlockListContext } from './context';

export function usePaginatedBlockList() {
  const queryClient = useQueryClient();
  const response = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const blocks = useSuspenseInfiniteQueryResult<Block>(response);

  const initialBurnBlocks: Record<string, UISingleBlock> = useMemo(
    () =>
      blocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = {
              type: UIBlockType.BurnBlock,
              height: block.burn_block_height,
              hash: block.burn_block_hash,
              timestamp: block.burn_block_time,
            };
          }
          return acc;
        },
        {} as Record<string, UISingleBlock>
      ),
    [blocks]
  );

  const stxBlocksGroupedByBurnBlock: Record<string, UISingleBlock[]> = useMemo(
    () =>
      blocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = [];
          }
          acc[block.burn_block_hash].push({
            type: UIBlockType.Block,
            height: block.height,
            hash: block.hash,
            timestamp: block.burn_block_time,
            txsCount: block.txs.length,
          });
          return acc;
        },
        {} as Record<string, UISingleBlock[]>
      ),
    [blocks]
  );

  const initialBlockList = useMemo(
    () =>
      Object.keys(stxBlocksGroupedByBurnBlock).reduce((acc, burnBlockHash) => {
        const stxBlocks = stxBlocksGroupedByBurnBlock[burnBlockHash];
        const burnBlock = initialBurnBlocks[burnBlockHash];
        acc.push(...stxBlocks, burnBlock);
        return acc;
      }, [] as UISingleBlock[]),
    [initialBurnBlocks, stxBlocksGroupedByBurnBlock]
  );

  const updateList = useCallback(
    function () {
      return queryClient.resetQueries({ queryKey: ['blockListInfinite'] });
    },
    [queryClient]
  );

  return {
    initialBlockList,
    initialBurnBlocks,
    updateList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
