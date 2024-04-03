'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Box } from '@/ui/Box';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListWebSocket } from '../Sockets/useBlockListWebSocket';
import { UISingleBlock } from '../types';
import { Blocks } from './Blocks';
import { BlockListProvider } from './Provider';
import { UpdateBar } from './UpdateBar';
import { FADE_DURATION } from './consts';
import { useBlockListContext } from './context';
import { usePaginatedBlockList } from './usePaginatedBlockList';

function PaginatedBlockListLayoutABase() {
  const { isBlockListLoading, setBlockListLoading, liveUpdates } = useBlockListContext();

  const [latestBlocksToShow, setLatestBlocksToShow] = useState<UISingleBlock[]>([]);

  const {
    initialBlockList,
    initialBurnBlocks,
    updateList,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePaginatedBlockList();

  const initialBlockHashes = useMemo(() => {
    return new Set(initialBlockList.map(block => block.hash));
  }, [initialBlockList]);

  const initialBurnBlockHashes = useMemo(() => {
    return new Set(Object.keys(initialBurnBlocks));
  }, [initialBurnBlocks]);

  const { latestUIBlocks, latestBlocksCount, clearLatestBlocks } = useBlockListWebSocket(
    initialBlockHashes,
    initialBurnBlockHashes
  );

  const showLatestBlocks = useCallback(() => {
    setLatestBlocksToShow(prevLatestBlocksToShow => {
      return [...latestUIBlocks, ...prevLatestBlocksToShow];
    });
    clearLatestBlocks();
  }, [clearLatestBlocks, latestUIBlocks]);

  const blockList = useMemo(
    () => [...latestBlocksToShow, ...initialBlockList],
    [initialBlockList, latestBlocksToShow]
  );

  const showLatestBlocksWithFadeEffect = useCallback(() => {
    setBlockListLoading(true);
    setTimeout(() => {
      showLatestBlocks();
      setBlockListLoading(false);
    }, FADE_DURATION);
  }, [setBlockListLoading, showLatestBlocks]);

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
      setLatestBlocksToShow([]);
      clearLatestBlocks();
      updateList().then(() => {
        setBlockListLoading(false);
      });
    } else if (receivedLatestBlockWhileLiveUpdates) {
      showLatestBlocksWithFadeEffect();
    }

    prevLiveUpdatesRef.current = liveUpdates;
    prevLatestBlocksCountRef.current = latestBlocksCount;
  }, [
    liveUpdates,
    latestBlocksCount,
    clearLatestBlocks,
    updateList,
    showLatestBlocksWithFadeEffect,
    setBlockListLoading,
  ]);

  return (
    <Box pb={6}>
      {!liveUpdates && (
        <UpdateBar
          isUpdateListLoading={isBlockListLoading}
          latestBlocksCount={latestBlocksCount}
          onClick={updateList}
        />
      )}
      <Blocks blockList={blockList} isUpdateListLoading={isBlockListLoading} />
      <Box pt={4}>
        {!liveUpdates && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            label={'blocks'}
          />
        )}
      </Box>
    </Box>
  );
}

export function PaginatedBlockListLayoutA() {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Recent Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <BlockListProvider>
        <PaginatedBlockListLayoutABase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
