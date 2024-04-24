'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Box } from '@/ui/Box';
import { Suspense } from 'react';

import { Section } from '../../../../common/components/Section';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListUngrouped } from '../Ungrouped/BlockListUngrouped';
import { BlocksPageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useBlocksPageBlockListUngrouped } from '../data/useBlocksPageBlockListUngrouped';

function BlocksPageBlockListUngroupedBase() {
  const { liveUpdates } = useBlockListContext();

  const {
    blockList,
    latestStxBlocksCountFromWebSocket,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    updateBlockList,
  } = useBlocksPageBlockListUngrouped();

  return (
    <Box pb={6}>
      {!liveUpdates && (
        <UpdateBar
          latestBlocksCount={latestStxBlocksCountFromWebSocket}
          onClick={updateBlockList}
        />
      )}
      <BlockListUngrouped blockList={blockList} />
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

export function BlocksPageBlockListUngrouped() {
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
      <Suspense fallback={<BlocksPageBlockListUngroupedSkeleton />}>
        <BlocksPageBlockListUngroupedBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
