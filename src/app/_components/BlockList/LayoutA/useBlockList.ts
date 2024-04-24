import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { useBlockListContext } from '../BlockListContext';
import { useBlockListWebSocketUIBlock } from '../Sockets/useBlockListWebSocketUIBlock';
import { FADE_DURATION } from '../consts';
import { UIBlock, UIBlockType } from '../types';
import { useInitialBlockList } from './useInitialBlockList';

const createBurnBlockUIBlock = (burnBlock: BurnBlock): UIBlock => ({
  type: UIBlockType.BurnBlock,
  height: burnBlock.burn_block_height,
  hash: burnBlock.burn_block_hash,
  timestamp: burnBlock.burn_block_time,
});

const createBlockUIBlock = (block: NakamotoBlock): UIBlock => ({
  type: UIBlockType.Block,
  height: block.height,
  hash: block.hash,
  timestamp: block.burn_block_time,
  txsCount: block.tx_count,
});

const createCountUIBlock = (count: number): UIBlock => ({
  type: UIBlockType.Count,
  count,
});

const createUIBlockList = (
  burnBlock: BurnBlock,
  stxBlocks: NakamotoBlock[],
  length: number
): UIBlock[] => {
  const blockList: UIBlock[] = [createBurnBlockUIBlock(burnBlock)];
  if (length <= 1) {
    return blockList;
  }
  const hasCount = burnBlock.stacks_blocks.length > length - 1;
  const stxBlocksToShow = stxBlocks.slice(0, length - 1 - (hasCount ? 1 : 0));

  if (hasCount) {
    blockList.unshift(createCountUIBlock(burnBlock.stacks_blocks.length - stxBlocksToShow.length));
  }

  stxBlocksToShow.reverse().forEach(block => {
    blockList.unshift(createBlockUIBlock(block));
  });

  return blockList;
};

export function useBlockList(length: number) {
  const queryClient = useQueryClient();
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const {
    lastBurnBlock,
    secondToLastBurnBlock,
    lastBurnBlockStxBlocks,
    secondToLastBlockStxBlocks,
  } = useInitialBlockList();

  const initialBlockHashes = useMemo(
    () =>
      new Set([
        ...lastBurnBlockStxBlocks.map(block => block.hash),
        ...secondToLastBlockStxBlocks.map(block => block.hash),
      ]),
    [lastBurnBlockStxBlocks, secondToLastBlockStxBlocks]
  );

  const initialBurnBlockHashes = useMemo(
    () => new Set([lastBurnBlock.burn_block_hash, secondToLastBurnBlock.burn_block_hash]),
    [lastBurnBlock, secondToLastBurnBlock]
  );

  const { latestBlock, latestBlocksCount, clearLatestBlocks } = useBlockListWebSocketUIBlock(
    initialBlockHashes,
    initialBurnBlockHashes
  );

  const updateList = useCallback(
    async function () {
      setBlockListLoading(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getBlocksByBurnBlock'] }),
        queryClient.invalidateQueries({ queryKey: ['burnBlocks'] }),
      ]);
      clearLatestBlocks();
      setBlockListLoading(false);
    },
    [clearLatestBlocks, queryClient, setBlockListLoading]
  );

  const prevLiveUpdatesRef = useRef(liveUpdates);
  const prevLatestBlocksCountRef = useRef(latestBlocksCount);

  useEffect(() => {
    const liveUpdatesToggled = prevLiveUpdatesRef.current !== liveUpdates;

    const receivedLatestBlockWhileLiveUpdates =
      liveUpdates &&
      latestBlocksCount > 0 &&
      prevLatestBlocksCountRef.current !== latestBlocksCount;

    if (liveUpdatesToggled) {
      setBlockListLoading(true);
      clearLatestBlocks();
      updateList().then(() => {
        setBlockListLoading(false);
      });
    } else if (receivedLatestBlockWhileLiveUpdates && latestBlock) {
      // If latest block belongs to the last burn block, add it to the list, otherwise trigger an update.
      if (latestBlock.burn_block_height === lastBurnBlock.burn_block_height) {
        setBlockListLoading(true);
        setTimeout(() => {
          lastBurnBlockStxBlocks.unshift(latestBlock);
          lastBurnBlock.stacks_blocks.unshift(latestBlock.hash);
          setBlockListLoading(false);
        }, FADE_DURATION);
      } else {
        clearLatestBlocks();
        void updateList();
      }
    }

    prevLiveUpdatesRef.current = liveUpdates;
    prevLatestBlocksCountRef.current = latestBlocksCount;
  }, [
    liveUpdates,
    latestBlocksCount,
    clearLatestBlocks,
    updateList,
    setBlockListLoading,
    latestBlock,
    lastBurnBlockStxBlocks,
    lastBurnBlock.stacks_blocks,
    lastBurnBlock.burn_block_height,
  ]);

  let blockList = createUIBlockList(lastBurnBlock, lastBurnBlockStxBlocks, length);

  if (blockList.length < length) {
    const secondToLastBlockList = createUIBlockList(
      secondToLastBurnBlock,
      secondToLastBlockStxBlocks,
      length - blockList.length
    );
    blockList = blockList.concat(secondToLastBlockList);
  }

  return {
    blockList,
    latestBlocksCount,
    updateList,
  };
}
