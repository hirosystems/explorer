'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../../common/hooks/useInfiniteQueryResult';
import {
  BLOCK_LIST_QUERY_KEY,
  useSuspenseBlocksInfiniteNew,
} from '../../../../../common/queries/useBlockListInfinite';
import { useBlockListContext } from '../../BlockListContext';
import { useBlockListWebSocket } from '../../Sockets/useBlockListWebSocket';
import { FADE_DURATION } from '../../consts';
import { BlockListBtcBlock, BlockListStxBlock, UISingleBlock } from '../../types';

const LIMIT = 3;

// TODO: move into shared file
function runAfterFadeOut(callback: () => void) {
  setTimeout(callback, FADE_DURATION);
}
/**
 * Fetch the initial stx blocks and burn blocks
 * Convert into rows and render
 * Fetch the latest stx blocks and burn blocks from websocket
 * To update, invalidate queries to requery
 * If live,
 * If just toggling live, requery to update
 * If receving new blocks while live, reorganize state to accomodate new blocks
 */
export function useHomePageBlockListUngrouped() {
  const { setBlockListLoading, liveUpdates } = useBlockListContext();

  const [latestBlocks, setLatestBlocks] = useState<UISingleBlock[]>([]);

  // TODO:
  // what if I queried for recent btc blocks. Took the first three. then queried for stx blocks for those btc blocks
  // This would give me the list of stx blocks for the first three btc blocks that I would need to show on the homepage
  // When updating just requery
  // when live updates are on, either insert them into the first btc block, or create a new btc block and pop the last one
  // Do this only if we require a more balanced view
  // This requires 4 queries
  // For now I can just rely on the blocks endpoint and show what I can
  const response = useSuspenseBlocksInfiniteNew();
  const initialStxBlocks = useSuspenseInfiniteQueryResult<NakamotoBlock>(response);
  const initialBtcBlocks: Record<string, BlockListBtcBlock> = useMemo(
    () =>
      initialStxBlocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = {
              type: 'btc_block',
              height: block.burn_block_height,
              hash: block.burn_block_hash,
              timestamp: block.burn_block_time,
              txsCount: undefined, // TODO: to get this I would have to make sure I have queried for all the stx blocks for this burn block and
            };
          }
          return acc;
        },
        {} as Record<string, BlockListBtcBlock>
      ),
    [initialStxBlocks]
  );
  const stxBlocksGroupedByBtcBlock: Record<string, BlockListStxBlock[]> = useMemo(
    // TODO: make a util function
    () =>
      initialStxBlocks.reduce(
        (acc, block) => {
          if (!acc[block.burn_block_hash]) {
            acc[block.burn_block_hash] = [];
          }
          acc[block.burn_block_hash].push({
            type: 'stx_block',
            height: block.height,
            hash: block.hash,
            timestamp: block.burn_block_time,
            txsCount: block.tx_count,
          });
          return acc;
        },
        {} as Record<string, BlockListStxBlock[]>
      ),
    [initialStxBlocks]
  );

  const initialBlockList = useMemo(
    // TODO: make a util function
    () =>
      Object.keys(stxBlocksGroupedByBtcBlock).reduce(
        (acc, btcBlockHash) => {
          const stxBlocks = stxBlocksGroupedByBtcBlock[btcBlockHash];
          const btcBlock = initialBtcBlocks[btcBlockHash];
          acc.push({ stxBlocks, btcBlock });
          return acc;
        },
        [] as { stxBlocks: BlockListStxBlock[]; btcBlock: BlockListBtcBlock }[]
      ),
    [initialBtcBlocks, stxBlocksGroupedByBtcBlock]
  );

  // TODO: so far we have not limited the list to two btc blocks and how many stx bloxks are shown and put in a placeholder for the rest of the stx blocks
  // for ensuring there are no duplicates
  const stxBlockHashes = useMemo(() => {
    return new Set(initialStxBlocks.map(block => block.hash));
  }, [initialStxBlocks]);

  const burnBlockHashes = useMemo(() => {
    return new Set(Object.keys(initialBtcBlocks));
  }, [initialBtcBlocks]);

  const {
    latestUIBlocks: latestUIBlockFromWebSocket,
    latestStxBlocksCount: latestStxBlocksCountFromWebSocket,
    clearLatestBlocks: clearLatestBlocksFromWebSocket,
  } = useBlockListWebSocket(stxBlockHashes, burnBlockHashes);

  const [blockListUpdateCounter, setBlockListUpdateCounter] = useState(0);
  // This is used to trigger a fade out effect when the block list is updated. When the counter is updated, we finish loading and show the fade in effect
  const prevBlockListUpdateCounterRef = useRef(blockListUpdateCounter);

  useEffect(() => {
    if (prevBlockListUpdateCounterRef.current !== blockListUpdateCounter) {
      runAfterFadeOut(() => {
        setBlockListLoading(false);
      });
    }
  }, [blockListUpdateCounter, clearLatestBlocksFromWebSocket, setBlockListLoading]);

  const queryClient = useQueryClient();
  const updateBlockListWithQuery = useCallback(
    async function () {
      setBlockListLoading(true);
      runAfterFadeOut(async () => {
        await Promise.all([
          // Invalidates queries so they will be refetched
          queryClient.invalidateQueries({ queryKey: [BLOCK_LIST_QUERY_KEY] }), // TODO: might be better to manually run the query again so we can use the callback
        ]).then(() => {
          clearLatestBlocksFromWebSocket();
          setBlockListUpdateCounter(prev => prev + 1);
        });
      });
    },
    [clearLatestBlocksFromWebSocket, queryClient, setBlockListLoading]
  );

  const showLatestBlocks = useCallback(() => {
    setBlockListLoading(true);
    runAfterFadeOut(() => {
      setLatestBlocks(prevBlockList => {
        return [...latestUIBlockFromWebSocket, ...prevBlockList];
      });
      clearLatestBlocksFromWebSocket();
      setBlockListUpdateCounter(prev => prev + 1);
    });
  }, [
    latestUIBlockFromWebSocket,
    setLatestBlocks,
    setBlockListLoading,
    clearLatestBlocksFromWebSocket,
  ]);

  const prevLiveUpdatesRef = useRef(liveUpdates);
  const prevLatestBlocksCountRef = useRef(latestStxBlocksCountFromWebSocket);
  useEffect(() => {
    const liveUpdatesToggled = prevLiveUpdatesRef.current !== liveUpdates;

    const receivedLatestStxBlockFromLiveUpdates =
      liveUpdates &&
      latestStxBlocksCountFromWebSocket > 0 &&
      prevLatestBlocksCountRef.current !== latestStxBlocksCountFromWebSocket;

    if (liveUpdatesToggled) {
      updateBlockListWithQuery();
    } else if (receivedLatestStxBlockFromLiveUpdates) {
      showLatestBlocks();
    }

    prevLiveUpdatesRef.current = liveUpdates;
    prevLatestBlocksCountRef.current = latestStxBlocksCountFromWebSocket;
  }, [liveUpdates, latestStxBlocksCountFromWebSocket, showLatestBlocks, updateBlockListWithQuery]);

  return {
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    blocksList: initialBlockList,
    updateBlockList: updateBlockListWithQuery,
  };
}
