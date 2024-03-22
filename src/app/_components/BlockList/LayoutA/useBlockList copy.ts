import { useGlobalContext } from '@/common/context/useAppContext';
import { useSuspenseInfiniteQueryResult } from '@/common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '@/common/queries/useBlockListInfinite';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BurnBlock, StacksApiSocketClient } from '@stacks/blockchain-api-client';
import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { EnhancedBlock, UIBlock, UIBlockType } from '../types';
import { FADE_DURATION } from './consts';
import { useBlockListContext } from './context';
import { useStacksApiSocketClient } from './use-stacks-api-socket-client';
import { useBlockListWebSocket } from './useBlockListWebSocket';
import { useInitialBlockList } from './useInitialBlockList';

('use client');

interface Subscription {
  unsubscribe(): Promise<void>;
}

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

export function useBlockList2(limit: number) {
  const [isLive, setIsLive] = useState(false);
  const [groupByBtcBlock, setGroupByBtcBlock] = useState(false);

  const [initialBlocks, setInitialBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);

  const activeNetwork = useGlobalContext().activeNetwork;

  const response = useSuspenseBlockListInfinite(); // queryKey: ['blockListInfinite', limit]
  const { isFetchingNextPage, fetchNextPage, hasNextPage } = response;
  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);

  // const { data: blocks, isFetchingNextPage, fetchNextPage, hasNextPage } = useSuspenseBlockListInfinite();

  const queryClient = useQueryClient();

  console.log('BlockList/index', { blocks });

  useEffect(() => {
    setInitialBlocks(blocks);
  }, [blocks]);

  const { connect: stacksApiSocketConnect, disconnect: stacksApiSocketDisconnect } =
    useStacksApiSocketClient();

  useEffect(() => {
    if (isLive) {
      void queryClient.invalidateQueries({ queryKey: ['blockListInfinite'] });
      stacksApiSocketConnect((socketClient: StacksApiSocketClient | undefined) => {
        socketClient?.subscribeBlocks((block: any) => {
          setLatestBlocks(prevLatestBlocks => [
            { ...block, microblock_tx_count: {}, animate: true },
            ...prevLatestBlocks,
          ]);
        });
      });
    } else {
      stacksApiSocketDisconnect();
    }
  }, [isLive, activeNetwork.url, stacksApiSocketConnect, stacksApiSocketDisconnect, queryClient]);

  // useEffect(() => {
  //   if (!isLive) return;
  //   void queryClient.invalidateQueries({ queryKey: ['blockListInfinite'] });
  //   let sub: {
  //     unsubscribe?: () => Promise<void>;
  //   };
  //   const subscribe = async () => {
  //     const client = await connectWebSocketClient(activeNetwork.url.replace('https://', 'wss://')); // TODO: Save this as ref so that when the live toggle is switched off, we can close the connection. Return subscribe and unsunscribe functions from the hook
  //     sub = await client.subscribeBlocks((block: any) => {
  //       setLatestBlocks(prevLatestBlocks => [
  //         { ...block, microblock_tx_count: {}, animate: true },
  //         ...prevLatestBlocks,
  //       ]);
  //     });
  //   };
  //   void subscribe();
  //   return () => {
  //     if (sub?.unsubscribe) {
  //       void sub.unsubscribe();
  //     }
  //   };
  // }, [activeNetwork.url, isLive, queryClient]);

  // const allBlocks = useMemo(() => {
  //   return [...latestBlocks, ...initialBlocks]
  //     .sort((a, b) => (b.height || 0) - (a.height || 0))
  //     .reduce((acc: EnhancedBlock[], block, index) => {
  //       if (!acc.some(b => b.height === block.height)) {
  //         acc.push({ ...block, destroy: index >= (limit || DEFAULT_LIST_LIMIT) });
  //       }
  //       return acc;
  //     }, []);
  // }, [initialBlocks, latestBlocks, limit]);

  // // whats happening here?
  // const removeOldBlock = useCallback((block: EnhancedBlock) => {
  //   setInitialBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
  //   setLatestBlocks(prevBlocks => prevBlocks.filter(b => b.height !== block.height));
  // }, []);

  if (groupByBtcBlock) {
    // TODO: group by btc block
  }

  return {
    setIsLive,
    setGroupByBtcBlock,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    blocks,
  };
}

export function useBlockList1() {
  const queryClient = useQueryClient();
  const { setIsUpdateListLoading, liveUpdates } = useBlockListContext();

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

  // Initial burn block hashes are used to filter out blocks that were already added to the list
  const initialBurnBlockHashes = useMemo(
    () => new Set([lastBurnBlock.burn_block_hash, secondToLastBurnBlock.burn_block_hash]),
    [lastBurnBlock, secondToLastBurnBlock]
  );

  const { latestBlock, latestBlocksCount, clearLatestBlocks } = useBlockListWebSocket(
    initialBlockHashes,
    initialBurnBlockHashes
  );

  const updateList = useCallback(
    async function () {
      setIsUpdateListLoading(true);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['getBlocksByBurnBlock'] }), // TODO: make these constants
        queryClient.invalidateQueries({ queryKey: ['burnBlocks'] }),
      ]);
      clearLatestBlocks();
      setIsUpdateListLoading(false);
    },
    [clearLatestBlocks, queryClient, setIsUpdateListLoading]
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
      setIsUpdateListLoading(true);
      clearLatestBlocks();
      updateList().then(() => {
        setIsUpdateListLoading(false);
      });
    } else if (receivedLatestBlockWhileLiveUpdates && latestBlock) {
      // If latest block belongs to the last burn block, add it to the list, otherwise trigger an update.
      if (latestBlock.burn_block_height === lastBurnBlock.burn_block_height) {
        setIsUpdateListLoading(true);
        setTimeout(() => {
          lastBurnBlockStxBlocks.unshift(latestBlock);
          lastBurnBlock.stacks_blocks.unshift(latestBlock.hash);
          setIsUpdateListLoading(false);
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
    setIsUpdateListLoading,
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
