'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client';

import { useBlockListContext } from '../BlockListContext';
import { useBlockListWebSocket3 } from '../Sockets/useBlockListWebSocket3';
import { FADE_DURATION } from '../consts';
import {
  BlockListData,
  convertBlockToBlockListBtcBlock,
  convertBlockToBlockListStxBlock,
  generateBlockList,
  useInitialBlockList,
} from '../useInitialBlocks';

function runAfterFadeOut(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}

function mergeWebSocketUpdates(
  latestStxBlocksFromWebSocket: NakamotoBlock[],
  initialBlockListDataMap: Record<string, BlockListData>
) {
  const initialBlockListDataMapCopy = Object.assign({}, initialBlockListDataMap);
  latestStxBlocksFromWebSocket.forEach(stxBlock => {
    // add the stx block to the existing btc block
    if (stxBlock.burn_block_hash in initialBlockListDataMap) {
      initialBlockListDataMapCopy[stxBlock.burn_block_hash].stxBlocks.push(
        convertBlockToBlockListStxBlock(stxBlock)
      );
    } else {
      // add a new btc block and stx block
      initialBlockListDataMapCopy[stxBlock.burn_block_hash] = {
        stxBlocks: [convertBlockToBlockListStxBlock(stxBlock)],
        btcBlock: convertBlockToBlockListBtcBlock(stxBlock),
      };
    }
  });
  return generateBlockList(initialBlockListDataMapCopy);
}

export function useUngroupedBlockListBlocksPage() {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  // TODO: dont really need to have a separate hook for this. This is just doing all the organizing of the data behind the hook
  const {
    initialStxBlocks,
    initialStxBlocksHashes,
    initialBtcBlocks,
    initialBtcBlocksHashes,
    initialBlockListDataMap,
    initialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    refetchInitialBlockList,
    hasNextPage,
  } = useInitialBlockList();

  const [latestBlocksToShow, setLatestBlocksToShow] = useState<BlockListData[]>([]);

  const {
    latestStxBlocks: latestStxBlocksFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestBlocks: clearLatestBlocksFromWebSocket,
  } = useBlockListWebSocket3(initialStxBlocksHashes);

  const blockList = useMemo(
    () => [...latestBlocksToShow, ...initialBlockList],
    [initialBlockList, latestBlocksToShow]
  );

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
    // const newBlockList = mergeWebSocketUpdates(
    //   latestStxBlocksFromWebSocket,
    //   initialBlockListDataMap
    // );
    setLatestBlocksToShow(latestStxBlocksFromWebSocket);
    clearLatestBlocksFromWebSocket();
    setBlockListUpdateCounter(prev => prev + 1);
  }, [
    latestStxBlocksFromWebSocket,
    initialBlockListDataMap,
    setLatestBlocksToShow,
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

  return {
    blockList,
    updateBlockList,
    latestStxBlocksCountFromWebSocket,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
