import { useCallback, useEffect, useRef, useState } from 'react';

import { useBlockListContext } from '../BlockListContext';
import { useBlockListWebSocket2 } from '../Sockets/useBlockListWebSocket2';
import { BlockListData, generateBlockList, mergeBlockLists, waitForFadeAnimation } from '../utils';
import { useHomePageInitialBlockList } from './useHomePageInitialBlockList';

export function useHomePageBlockList(btcBlockLimit: number = 3) {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const { initialBlockList, initialStxBlocksHashes, refetchInitialBlockList } =
    useHomePageInitialBlockList();

  // initially the block list is the initial blocklist
  const [blockList, setBlockList] = useState<BlockListData[]>(initialBlockList);
  // when the initial block list changes, reset the block list to the initial blocklist
  useEffect(() => {
    setBlockList(initialBlockList);
  }, [initialBlockList]);

  // manually update the block list with block list updates from the websocket
  const updateBlockListManually = useCallback(
    (blockListUpdates: BlockListData[]) => {
      const newBlockList = mergeBlockLists(blockListUpdates, blockList).slice(0, btcBlockLimit);
      setBlockList(newBlockList);
    },
    [blockList, btcBlockLimit]
  );

  const {
    latestStxBlocks: latestStxBlocksFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestStxBlocks: clearLatestStxBlocksFromWebSocket,
  } = useBlockListWebSocket2(liveUpdates, initialStxBlocksHashes);

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
        await refetchInitialBlockList(() => {
          clearLatestStxBlocksFromWebSocket();
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
  };
}
