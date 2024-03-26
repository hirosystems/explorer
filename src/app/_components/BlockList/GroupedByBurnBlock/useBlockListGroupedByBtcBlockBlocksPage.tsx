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
import { UIBlockType, UISingleBlock } from '../types';
import { BlocksGroupProps } from './BlocksGroup';
import { useBlockListWebSocket } from './useBlockListWebSocket';

const STX_BLOCK_LENGTH = 10;
const BURN_BLOCK_LENGTH = 10;

export function useBlockListGroupedByBtcBlockBlocksPage(blockListLimit: number) {
  const queryClient = useQueryClient();
  const { setIsUpdateListLoading: setIsBlockListUpdateLoading, liveUpdates: isLiveUpdateEnabled } =
    useBlockListContext();

  const response = useSuspenseBurnBlocks(BURN_BLOCK_LENGTH);
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
    () =>
      new Set([
        ...burnBlocks.map(block => block.burn_block_hash),
      ]),
    [burnBlocks]
  );

  const {
    latestBlock: latestStxBlock,
    latestBlocksCount: latestStxBlocksWaitingToBeLoaded,
    clearLatestBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket(stxBlockHashes, burnBlockHashes); // TODO: fix this

  const updateBlockList = useCallback(
    async function () {
      setIsBlockListUpdateLoading(true);
      await Promise.all([
        // invalidates queries so that they can be refetched
        queryClient.invalidateQueries({ queryKey: [GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [BURN_BLOCKS_QUERY_KEY] }),
      ]);
      clearLatestStxBlocksFromWebSocket(); // clears blocks from socket connection
      setIsBlockListUpdateLoading(false);
    },
    [clearLatestStxBlocksFromWebSocket, queryClient, setIsBlockListUpdateLoading]
  );

  const prevIsLiveUpdateEnabledRef = useRef(isLiveUpdateEnabled);
  const prevLatestBlocksCountRef = useRef(latestStxBlocksWaitingToBeLoaded);

  useEffect(() => {
    const liveUpdatesJustToggled = prevIsLiveUpdateEnabledRef.current !== isLiveUpdateEnabled;

    // If live updates are enabled and oe or more new blocks have been received, verified by checking the latest block count and the previous latest block count, then
    // add the latest block to the list of blocks
    const receivedLatestBlockWhileLiveUpdates =
      isLiveUpdateEnabled &&
      latestStxBlocksWaitingToBeLoaded > 0 && // data coming from the websocket
      prevLatestBlocksCountRef.current !== latestStxBlocksWaitingToBeLoaded;

    // If live updates have just been toggled, then refetch/update the block list
    if (liveUpdatesJustToggled) {
      setIsBlockListUpdateLoading(true);
      clearLatestStxBlocksFromWebSocket();
      updateBlockList().then(() => {
        setIsBlockListUpdateLoading(false);
      });
    } else if (receivedLatestBlockWhileLiveUpdates && latestStxBlock) {
      // If latest stx block belongs to the latest burn block, add it to the latest burn block list of stx blocks
      if (latestStxBlock.burn_block_height === latestBurnBlock.burn_block_height) {
        setIsBlockListUpdateLoading(true);
        setTimeout(() => {
          latestBurnBlockStxBlocks.unshift(latestStxBlock);
          latestBurnBlock.stacks_blocks.unshift(latestStxBlock.hash);
          setIsBlockListUpdateLoading(false);
        }, FADE_DURATION);
      } else {
        // Otherwise, we have a new burn block, and in this situation, adding a new burn block is the equivalent of refetching/updating the block list
        clearLatestStxBlocksFromWebSocket();
        void updateBlockList();
      }
    }

    prevIsLiveUpdateEnabledRef.current = isLiveUpdateEnabled;
    prevLatestBlocksCountRef.current = latestStxBlocksWaitingToBeLoaded;
  }, [
    latestStxBlock,
    latestStxBlocksWaitingToBeLoaded,
    isLiveUpdateEnabled,
    latestBurnBlock,
    latestBurnBlockStxBlocks,
    latestBurnBlock.stacks_blocks,
    latestBurnBlock.burn_block_height,
    clearLatestStxBlocksFromWebSocket,
    updateBlockList,
    setIsBlockListUpdateLoading,
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
        timestamp: block.burn_block_time,
      })),
      stxBlocksDisplayLimit: blockListLimit,
    },
    ...restOfBlockList,
  ];

  return {
    blockList,
    updateBlockList,
    latestBlocksCount: latestStxBlocksWaitingToBeLoaded,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
