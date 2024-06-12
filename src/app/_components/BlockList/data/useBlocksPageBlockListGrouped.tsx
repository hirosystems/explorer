import { useCallback, useEffect, useRef, useState } from 'react';

import { useBlockListContext } from '../BlockListContext';
import { useBlockListWebSocket } from '../Sockets/useBlockListWebSocket';
import { BlockListData, generateBlockList, mergeBlockLists, waitForFadeAnimation } from '../utils';
import { useBlockListBtcBlocks } from './useBlockListBtcBlocks';
import { useBlocksGroupedInitialBlockList } from './useBlocksPageGroupedInitialBlockList';
import { generateBtcBlocksMap } from './utils';

export function useBlocksPageBlockListGrouped(btcBlockLimit: number = 10) {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const {
    initialStxBlockHashes,
    initialBlockList,
    refetchInitialBlockList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useBlocksGroupedInitialBlockList(btcBlockLimit);

  // initially the block list is the initial blocklist
  const [blockList, setBlockList] = useState<BlockListData[]>(initialBlockList);
  // when the initial block list changes, reset the block list to the initial blocklist
  useEffect(() => {
    setBlockList(initialBlockList);
  }, [initialBlockList]);

  const {
    latestStxBlocks: latestStxBlocksFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestStxBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket(liveUpdates, initialStxBlockHashes);

  // manually update the block list with block list updates from the websocket
  const updateBlockListManually = useCallback(
    (blockListUpdates: BlockListData[]) => {
      const newBlockList = mergeBlockLists(blockListUpdates, blockList);
      setBlockList(newBlockList);
    },
    [blockList]
  );

  const { btcBlocks: latestBtcBlocks } = useBlockListBtcBlocks(latestStxBlocksFromWebSocket);

  const showLatestStxBlocksFromWebSocket = useCallback(() => {
    setBlockListLoading(true);
    waitForFadeAnimation(() => {
      const websocketBlockList = generateBlockList(
        latestStxBlocksFromWebSocket,
        generateBtcBlocksMap(latestBtcBlocks)
      );
      updateBlockListManually(websocketBlockList);
      clearLatestStxBlocksFromWebSocket();
      setBlockListLoading(false);
    });
  }, [
    latestStxBlocksFromWebSocket,
    updateBlockListManually,
    setBlockListLoading,
    clearLatestStxBlocksFromWebSocket,
    latestBtcBlocks,
  ]);

  const updateBlockListWithQuery = useCallback(
    async function () {
      setBlockListLoading(true);
      waitForFadeAnimation(async () => {
        clearLatestStxBlocksFromWebSocket();
        await refetchInitialBlockList(() => {
          setBlockListLoading(false);
        });
      });
    },
    [clearLatestStxBlocksFromWebSocket, setBlockListLoading, refetchInitialBlockList]
  );

  const prevLiveUpdatesRef = useRef(liveUpdates);
  const prevLatestStxBlocksCountRef = useRef(latestStxBlocksCountFromWebSocket);
  // Handles live updates
  useEffect(() => {
    const liveUpdatesToggled = prevLiveUpdatesRef.current !== liveUpdates;

    const receivedLatestStxBlockFromLiveUpdates =
      liveUpdates &&
      latestStxBlocksCountFromWebSocket > 0 &&
      prevLatestStxBlocksCountRef.current !== latestStxBlocksCountFromWebSocket;

    if (liveUpdatesToggled) {
      updateBlockListWithQuery();
    } else if (receivedLatestStxBlockFromLiveUpdates) {
      showLatestStxBlocksFromWebSocket();
    }

    prevLiveUpdatesRef.current = liveUpdates;
    prevLatestStxBlocksCountRef.current = latestStxBlocksCountFromWebSocket;
  }, [
    liveUpdates,
    latestStxBlocksCountFromWebSocket,
    showLatestStxBlocksFromWebSocket,
    updateBlockListWithQuery,
  ]);

  return {
    blockList,
    updateBlockList: updateBlockListWithQuery,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
