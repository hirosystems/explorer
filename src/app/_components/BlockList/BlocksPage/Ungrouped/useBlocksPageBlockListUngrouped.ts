'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Block, NakamotoBlock } from '@stacks/blockchain-api-client';

import { useBlockListContext } from '../../BlockListContext';
import { useBlockListWebSocket3 } from '../../Sockets/useBlockListWebSocket3';
import { FADE_DURATION } from '../../consts';
import {
  BlockListData,
  convertBlockToBlockListBtcBlock,
  convertBlockToBlockListStxBlock,
  useInitialBlockList,
} from '../../useInitialBlocks';

function runAfterFadeOut(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}

function generateBlockList(stxBlocks: (Block | NakamotoBlock)[]) {
  if (stxBlocks.length === 0) return [];
  const blockList = [
    {
      stxBlocks: [convertBlockToBlockListStxBlock(stxBlocks[0])],
      btcBlock: convertBlockToBlockListBtcBlock(stxBlocks[0]),
    },
  ];
  if (stxBlocks.length === 1) return blockList;
  for (let i = 1; i < stxBlocks.length; i++) {
    const stxBlock = stxBlocks[i];
    const latestBtcBlock = blockList[blockList.length - 1];
    if (latestBtcBlock.btcBlock.hash === stxBlock.burn_block_hash) {
      latestBtcBlock.stxBlocks.push(convertBlockToBlockListStxBlock(stxBlock));
    } else {
      blockList.push({
        stxBlocks: [convertBlockToBlockListStxBlock(stxBlock)],
        btcBlock: convertBlockToBlockListBtcBlock(stxBlock),
      });
    }
  }
  return blockList;
}

function mergeBlockLists(newblockList: BlockListData[], initialBlockList: BlockListData[]) {
  if (newblockList.length === 0) return initialBlockList;
  const earliestBtcBlock = newblockList[newblockList.length - 1];
  const latestBtcBlock = initialBlockList[0];
  if (earliestBtcBlock.btcBlock.hash === latestBtcBlock.btcBlock.hash) {
    const btcBlock = earliestBtcBlock.btcBlock || latestBtcBlock.btcBlock;
    const stxBlocks = [...earliestBtcBlock.stxBlocks, ...latestBtcBlock.stxBlocks];
    return [
      ...newblockList.slice(0, newblockList.length - 1),
      { btcBlock, stxBlocks },
      ,
      ...initialBlockList.slice(1),
    ];
  } else {
    return [...newblockList, ...initialBlockList];
  }
}

export function useBlocksPageBlockListUngrouped() {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const {
    initialStxBlocksHashes,
    initialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitialBlockList,
    hasNextPage,
  } = useInitialBlockList();

  const [webSocketBlockList, setWebSocketBlockList] = useState<BlockListData[]>([]);

  const {
    latestStxBlocks: latestStxBlocksFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestBlocks: clearLatestBlocksFromWebSocket,
  } = useBlockListWebSocket3(initialStxBlocksHashes);

  // This is used to trigger a fade out effect when the block list is updated.
  // When the counter is updated, we wait for the fade out effect to finish and then show the fade in effect
  const [blockListUpdateCounter, setBlockListUpdateCounter] = useState(0);
  const prevBlockListUpdateCounterRef = useRef(blockListUpdateCounter);
  useEffect(() => {
    if (prevBlockListUpdateCounterRef.current !== blockListUpdateCounter) {
      setBlockListLoading(false);
      // runAfterFadeOut(() => {
      //   setBlockListLoading(false);
      // });
    }
  }, [blockListUpdateCounter, clearLatestBlocksFromWebSocket, setBlockListLoading]);

  const showLatestStxBlocksFromWebSocket = useCallback(() => {
    setBlockListLoading(true);
    const websocketBlockList = generateBlockList(latestStxBlocksFromWebSocket);
    setWebSocketBlockList(websocketBlockList);
    clearLatestBlocksFromWebSocket();
    setBlockListUpdateCounter(prev => prev + 1);
  }, [
    latestStxBlocksFromWebSocket,
    setWebSocketBlockList,
    setBlockListLoading,
    clearLatestBlocksFromWebSocket,
  ]);

  const updateBlockList = useCallback(
    async function () {
      setBlockListLoading(true);
      await refetchInitialBlockList(() => {
        clearLatestBlocksFromWebSocket();
        setBlockListUpdateCounter(prev => prev + 1);
      });
    },
    [clearLatestBlocksFromWebSocket, setBlockListLoading, refetchInitialBlockList]
  );

  const prevLiveUpdatesRef = useRef(liveUpdates);
  const prevLatestBlocksCountRef = useRef(latestStxBlocksCountFromWebSocket);
  // Handles live updates
  useEffect(() => {
    const liveUpdatesToggled = prevLiveUpdatesRef.current !== liveUpdates;

    const receivedLatestStxBlockFromLiveUpdates =
      liveUpdates &&
      latestStxBlocksCountFromWebSocket > 0 &&
      prevLatestBlocksCountRef.current !== latestStxBlocksCountFromWebSocket;

    if (liveUpdatesToggled) {
      updateBlockList();
    } else if (receivedLatestStxBlockFromLiveUpdates) {
      showLatestStxBlocksFromWebSocket();
    }

    prevLiveUpdatesRef.current = liveUpdates;
    prevLatestBlocksCountRef.current = latestStxBlocksCountFromWebSocket;
  }, [
    liveUpdates,
    latestStxBlocksCountFromWebSocket,
    showLatestStxBlocksFromWebSocket,
    updateBlockList,
  ]);

  const blockList = useMemo(
    () => mergeBlockLists(webSocketBlockList, initialBlockList),
    [webSocketBlockList, initialBlockList]
  );

  return {
    blockList,
    updateBlockList,
    latestStxBlocksCountFromWebSocket,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
