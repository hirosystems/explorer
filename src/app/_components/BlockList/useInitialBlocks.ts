import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { Block, NakamotoBlock } from '@stacks/stacks-blockchain-api-types';

import { useSuspenseInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import {
  BLOCK_LIST_QUERY_KEY,
  useSuspenseBlockListInfinite,
} from '../../../common/queries/useBlockListInfinite';
import { BlockListBtcBlock, BlockListStxBlock } from './types';

export function convertBlockToBlockListStxBlock(block: Block | NakamotoBlock): BlockListStxBlock {
  return {
    type: 'stx_block',
    height: block.height,
    hash: block.hash,
    timestamp: block.burn_block_time,
    txsCount: (block as Block)?.txs.length ?? (block as NakamotoBlock)?.tx_count,
  };
}
export function convertBlockToBlockListBtcBlock(block: Block | NakamotoBlock): BlockListBtcBlock {
  return {
    type: 'btc_block',
    height: block.burn_block_height,
    hash: block.burn_block_hash,
    timestamp: block.burn_block_time,
  };
}

export type BlockListData = { stxBlocks: BlockListStxBlock[]; btcBlock: BlockListBtcBlock };

// TODO: can and should probably simplify this code. Turn this into a function - make blocklist
export function generateBlockList(
  blockListDataMap: Record<string, BlockListData>
): BlockListData[] {
  return Object.values(blockListDataMap).sort((a, b) => {
    const bHeight =
      typeof b.btcBlock.height === 'string'
        ? Number.parseInt(b.btcBlock.height)
        : b.btcBlock.height;
    const aHeight =
      typeof a.btcBlock.height === 'string'
        ? Number.parseInt(a.btcBlock.height)
        : a.btcBlock.height;
    return bHeight - aHeight;
  });
}

export function useInitialBlockList() {
  const queryClient = useQueryClient();
  const response = useSuspenseBlockListInfinite();
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const blocks = useSuspenseInfiniteQueryResult<Block>(response);

  const initialStxBlocks: Record<string, BlockListStxBlock> = useMemo(
    () =>
      blocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = convertBlockToBlockListStxBlock(block);
          }
          return acc;
        },
        {} as Record<string, BlockListStxBlock>
      ),
    [blocks]
  );

  const initialStxBlocksHashes = useMemo(
    () => new Set(Object.keys(initialStxBlocks)),
    [initialStxBlocks]
  );

  const initialBtcBlocks: Record<string, BlockListBtcBlock> = useMemo(
    () =>
      blocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = convertBlockToBlockListBtcBlock(block);
          }
          return acc;
        },
        {} as Record<string, BlockListBtcBlock>
      ),
    [blocks]
  );

  const initialBtcBlocksHashes = useMemo(
    () => new Set(Object.keys(initialBtcBlocks)),
    [initialBtcBlocks]
  );

  // btc block hash -> BlockListData
  const initialBlockListDataMap: Record<string, BlockListData> = useMemo(
    () =>
      blocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = {
              stxBlocks: [],
              btcBlock: convertBlockToBlockListBtcBlock(block),
            };
          }
          acc[block.burn_block_hash].stxBlocks.push(convertBlockToBlockListStxBlock(block));
          return acc;
        },
        {} as Record<string, BlockListData>
      ),
    [blocks]
  );

  const initialBlockList = useMemo(
    () => generateBlockList(initialBlockListDataMap),
    [initialBlockListDataMap]
  );

  const refetchInitialBlockList = useCallback(
    function (callback: () => void) {
      //   return queryClient.resetQueries({ queryKey: ['blockListInfinite'] });
      queryClient.refetchQueries({ queryKey: [BLOCK_LIST_QUERY_KEY] }).then(() => callback());
    },
    [queryClient]
  );

  return {
    initialStxBlocks,
    initialStxBlocksHashes,
    initialBtcBlocks,
    initialBtcBlocksHashes,
    initialBlockListDataMap,
    initialBlockList,
    refetchInitialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
