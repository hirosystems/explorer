'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { UISingleBlock } from '../types';
import { BlockListWithControls } from './BlockListWithControls';
import { BlockListProvider } from './Provider';
import { FADE_DURATION } from './consts';
import { useBlockListContext } from './context';
import { useBlockListWebSocket } from './useBlockListWebSocket';
import { usePaginatedBlockList } from './usePaginatedBlockList';

function PaginatedBlockListLayoutABase() {
  const { setIsUpdateListLoading, liveUpdates } = useBlockListContext();
  const [latestBlocksToShow, setLatestBlocksToShow] = useState<UISingleBlock[]>([]);

  const { initialBlockList, initialBurnBlocks, updateList, hasNextPage, isFetchingNextPage } =
    usePaginatedBlockList();

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
    setIsUpdateListLoading(true);
    setTimeout(() => {
      showLatestBlocks();
      setIsUpdateListLoading(false);
    }, FADE_DURATION);
  }, [setIsUpdateListLoading, showLatestBlocks]);

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
      setLatestBlocksToShow([]);
      clearLatestBlocks();
      updateList().then(() => {
        setIsUpdateListLoading(false);
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
    setIsUpdateListLoading,
  ]);

  return (
    <BlockListWithControls
      enablePagination
      blockList={blockList}
      latestBlocksCount={latestBlocksCount}
      updateList={showLatestBlocksWithFadeEffect}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      horizontalControls
    />
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
