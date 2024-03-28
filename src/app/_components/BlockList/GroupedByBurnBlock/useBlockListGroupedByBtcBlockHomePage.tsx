import { GET_BLOCKS_BY_BURN_BLOCK_QUERY_KEY } from '@/common/queries/useBlocksByBurnBlock';
import { BURN_BLOCKS_QUERY_KEY } from '@/common/queries/useBurnBlocks';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { FADE_DURATION } from '../LayoutA/consts';
import { useBlockListContext } from '../LayoutA/context';
import { UIBlockType } from '../types';
import { BlocksGroupProps } from './BurnBlockGroup';
import { useBlockListWebSocket } from './useBlockListWebSocket';
import { useInitialBlockListGroupedByBtcBlockHomePage } from './useInitialBlockListGroupedByBtcHomePage';

export function useBlockListGroupedByBtcBlockHomePage() {
  const queryClient = useQueryClient();
  const { setBlockListLoading: setIsBlockListUpdateLoading, liveUpdates: isLiveUpdateEnabled } =
    useBlockListContext();

  const {
    latestBurnBlock,
    latestBurnBlockStxBlocks,
    secondLatestBurnBlock,
    secondLatestBurnBlockStxBlocks,
    thirdLatestBurnBlock,
    thirdLatestBurnBlockStxBlocks,
  } = useInitialBlockListGroupedByBtcBlockHomePage();

  const initialStxBlockHashes = useMemo(
    () =>
      new Set([
        ...latestBurnBlockStxBlocks.map(block => block.hash),
        ...secondLatestBurnBlockStxBlocks.map(block => block.hash),
        ...thirdLatestBurnBlockStxBlocks.map(block => block.hash),
      ]),
    [latestBurnBlockStxBlocks, secondLatestBurnBlockStxBlocks, thirdLatestBurnBlockStxBlocks]
  );
  const initialBurnBlockHashes = useMemo(
    () =>
      new Set([
        latestBurnBlock.burn_block_hash,
        secondLatestBurnBlock.burn_block_hash,
        thirdLatestBurnBlock.burn_block_hash,
      ]),
    [latestBurnBlock, secondLatestBurnBlock, thirdLatestBurnBlock]
  );

  const {
    latestBlock: latestStxBlock,
    latestBlocksCount: latestStxBlocksWaitingToBeLoaded,
    clearLatestBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket(initialStxBlockHashes, initialBurnBlockHashes); // TODO: fix this

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
          // latestBurnBlockStxBlocks.pop();
          // latestBurnBlock.stacks_blocks.pop();
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

  // all btc block groups are rendered the same
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
      stxBlocksDisplayLimit: 3,
    },
    {
      burnBlock: {
        type: UIBlockType.BurnBlock,
        height: secondLatestBurnBlock.burn_block_height,
        hash: secondLatestBurnBlock.burn_block_hash,
        timestamp: secondLatestBurnBlock.burn_block_time,
        txsCount: secondLatestBurnBlock.stacks_blocks.length,
      },
      stxBlocks: secondLatestBurnBlockStxBlocks.map(block => ({
        type: UIBlockType.StxBlock,
        height: block.height,
        hash: block.hash,
        timestamp: block.burn_block_time,
      })),
      stxBlocksDisplayLimit: 3,
    },
    {
      burnBlock: {
        type: UIBlockType.BurnBlock,
        height: thirdLatestBurnBlock.burn_block_height,
        hash: thirdLatestBurnBlock.burn_block_hash,
        timestamp: thirdLatestBurnBlock.burn_block_time,
        txsCount: thirdLatestBurnBlock.stacks_blocks.length,
      },
      stxBlocks: thirdLatestBurnBlockStxBlocks.map(block => ({
        type: UIBlockType.StxBlock,
        height: block.height,
        hash: block.hash,
        timestamp: block.burn_block_time,
      })),
      stxBlocksDisplayLimit: 3,
    },
  ];

  return {
    blockList,
    updateBlockList,
    latestBlocksCount: latestStxBlocksWaitingToBeLoaded,
  };
}
