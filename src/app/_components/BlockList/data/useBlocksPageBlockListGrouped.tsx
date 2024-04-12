import { useCallback, useEffect, useRef } from 'react';

import { useBlockListContext } from '../BlockListContext';
import { useBlockListWebSocket2 } from '../Sockets/useBlockListWebSocket2';
import { BlockListData, generateBlockList, mergeBlockLists, waitForFadeAnimation } from '../utils';
import { useBlocksPageBlockListGroupedInitialBlockList } from './useBlocksPageBlockListGroupedInitialBlockList';

export function useBlocksPageBlockListGrouped(btcBlockLimit: number = 10) {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const {
    initialStxBlockHashes,
    initialBlockList,
    refetchInitialBlockList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useBlocksPageBlockListGroupedInitialBlockList(btcBlockLimit);

  // initially the block list is the initial blocklist
  const blockList = useRef<BlockListData[]>(initialBlockList);
  // when the initial block list changes, reset the block list to the initial blocklist
  useEffect(() => {
    blockList.current = initialBlockList;
  }, [initialBlockList]);

  const {
    latestStxBlocks: latestStxBlocksFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestStxBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket2(initialStxBlockHashes);

  // manually update the block list with block list updates from the websocket
  const updateBlockListManually = useCallback((blockListUpdates: BlockListData[]) => {
    const newBlockList = mergeBlockLists(blockListUpdates, blockList.current);
    blockList.current = newBlockList;
  }, []);

  const showLatestStxBlocksFromWebSocket = useCallback(() => {
    setBlockListLoading(true);
    waitForFadeAnimation(() => {
      const websocketBlockList = generateBlockList(latestStxBlocksFromWebSocket);
      updateBlockListManually(websocketBlockList);
      clearLatestStxBlocksFromWebSocket();
      setBlockListLoading(false);
    });
  }, [
    latestStxBlocksFromWebSocket,
    updateBlockListManually,
    setBlockListLoading,
    clearLatestStxBlocksFromWebSocket,
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
    blockList: blockList.current,
    updateBlockList: updateBlockListWithQuery,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
}
