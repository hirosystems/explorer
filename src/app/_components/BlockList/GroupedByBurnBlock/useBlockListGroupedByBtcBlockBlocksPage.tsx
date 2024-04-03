import { GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY } from '@/common/queries/useBlocksByBurnBlock';
import { BURN_BLOCKS_QUERY_KEY } from '@/common/queries/useBurnBlocks';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocks';
import { FADE_DURATION } from '../LayoutA/consts';
import { useBlockListContext } from '../LayoutA/context';
import { useBlockListWebSocket } from '../Sockets/useBlockListWebSocket2';
import { UIBlockType, UISingleBlock } from '../types';
import { BlocksGroupProps } from './BurnBlockGroup';

const STX_BLOCK_LENGTH = 10;
const BURN_BLOCK_LENGTH = 10;

export function useBlockListGroupedByBtcBlockBlocksPage(blockListLimit: number) {
  const queryClient = useQueryClient();
  const { setBlockListLoading, liveUpdates: isLiveUpdatesEnabled } = useBlockListContext();

  const response = useSuspenseBurnBlocks(BURN_BLOCK_LENGTH, {}, 'blockList');
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(response);

  const latestBurnBlock = useMemo(() => burnBlocks[0], [burnBlocks]);

  const latestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(latestBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );

  const stxBlockHashes = useMemo(
    () => new Set([...latestBurnBlockStxBlocks.map(block => block.hash)]),
    [latestBurnBlockStxBlocks]
  );
  const burnBlockHashes = useMemo(
    () => new Set([...burnBlocks.map(block => block.burn_block_hash)]),
    [burnBlocks]
  );

  const {
    latestBlock: latestStxBlockFromWebSocket,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket(stxBlockHashes, burnBlockHashes); // TODO: fix this

  const updateBlockList = useCallback(
    async function () {
      setBlockListLoading(true);
      await Promise.all([
        // Invalidates queries so they will be refetched
        queryClient.invalidateQueries({ queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [BURN_BLOCKS_QUERY_KEY] }),
      ]);
      clearLatestStxBlocksFromWebSocket(); // clears updates since we are get the latest data from refetching the queries
      setBlockListLoading(false);
    },
    [clearLatestStxBlocksFromWebSocket, queryClient, setBlockListLoading]
  );

  const prevIsLiveUpdateEnabledRef = useRef(isLiveUpdatesEnabled);
  const prevLatestStxBlocksCountRef = useRef(latestStxBlocksCountFromWebSocket);

  useEffect(() => {
    const liveUpdatesToggled = prevIsLiveUpdateEnabledRef.current !== isLiveUpdatesEnabled;

    // If live updates are enabled and one or more new blocks have been received, verified by checking the latest block count and the previous latest block count, then
    // add the latest block to the list of blocks
    const receivedLatestStxBlockFromLiveUpdates =
      isLiveUpdatesEnabled &&
      latestStxBlocksCountFromWebSocket > 0 && // stx blocks data coming from the websocket
      prevLatestStxBlocksCountRef.current !== latestStxBlocksCountFromWebSocket;

    // If live updates have been toggled, then refetch/update the block list
    if (liveUpdatesToggled) {
      setBlockListLoading(true); // TODO: can I remove the setBlockListLoading(true) and setBlockListLoading(false) from here? since it's already in the updateBlockList function
      updateBlockList().then(() => {
        setBlockListLoading(false);
      });
    } else if (receivedLatestStxBlockFromLiveUpdates && latestStxBlockFromWebSocket) {
      // If latest stx block belongs to the latest burn block, add it to the latest burn block list of stx blocks
      if (latestStxBlockFromWebSocket.burn_block_height === latestBurnBlock.burn_block_height) {
        setBlockListLoading(true);
        setTimeout(() => {
          latestBurnBlockStxBlocks.unshift(latestStxBlockFromWebSocket);
          latestBurnBlock.stacks_blocks.unshift(latestStxBlockFromWebSocket.hash);
          setBlockListLoading(false);
        }, FADE_DURATION);
      } else {
        // Otherwise, we have a new burn block, in which case, adding a new burn block is the equivalent of refetching/updating the block list
        updateBlockList();
      }
    }

    prevIsLiveUpdateEnabledRef.current = isLiveUpdatesEnabled;
    prevLatestStxBlocksCountRef.current = latestStxBlocksCountFromWebSocket;
  }, [
    latestStxBlockFromWebSocket,
    latestStxBlocksCountFromWebSocket,
    isLiveUpdatesEnabled,
    latestBurnBlock,
    latestBurnBlockStxBlocks,
    latestBurnBlock.stacks_blocks,
    latestBurnBlock.burn_block_height,
    clearLatestStxBlocksFromWebSocket,
    updateBlockList,
    setBlockListLoading,
  ]);

  const restOfBlockList: BlocksGroupProps[] = burnBlocks.slice(1).map(burnBlock => ({
    burnBlock: {
      type: UIBlockType.BurnBlock,
      height: burnBlock.burn_block_height,
      hash: burnBlock.burn_block_hash,
      timestamp: burnBlock.burn_block_time,
      txsCount: burnBlock.stacks_blocks.length,
    },
    stxBlocks: [] as UISingleBlock[],
    stxBlocksDisplayLimit: 0,
  }));

  const blockList: BlocksGroupProps[] = [
    {
      burnBlock: {
        type: UIBlockType.BurnBlock,
        height: latestBurnBlock.burn_block_height,
        hash: latestBurnBlock.burn_block_hash,
        timestamp: latestBurnBlock.burn_block_time,
        txsCount: latestBurnBlock.stacks_blocks.length,
      },
      stxBlocks: latestBurnBlockStxBlocks.map(block => ({
        type: UIBlockType.StxBlock,
        height: block.height,
        hash: block.hash,
        timestamp: block?.block_time, // block?.block_time TODO: this is the right timestamp to use, but it seems to be inaccurate
        txsCount: block.tx_count,
      })),
      stxBlocksDisplayLimit: blockListLimit,
    },
    ...restOfBlockList,
  ];

  return {
    blockList,
    updateBlockList,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
