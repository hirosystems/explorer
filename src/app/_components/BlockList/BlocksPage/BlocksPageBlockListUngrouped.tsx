'use client';

import { Suspense, useMemo } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListUngrouped } from '../Ungrouped/BlockListUngrouped';
import { BlocksPageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useBlocksPageBlockListUngrouped } from '../data/useBlocksPageBlockListUngrouped';

function BlocksPageBlockListUngroupedBase() {
  const { liveUpdates } = useBlockListContext();

  const { blockList, hasNextPage, fetchNextPage, isFetchingNextPage, updateBlockList } =
    useBlocksPageBlockListUngrouped();
  const latestBlock = useMemo(() => blockList?.[0], [blockList]);

  return (
    <Box pb={6}>
      {!liveUpdates && <UpdateBar onClick={updateBlockList} latestBlock={latestBlock} />}
      <BlockListUngrouped blockList={blockList} stxBlocksLimit={10} />
      <Box pt={4}>
        <ListFooter
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          label={'blocks'}
        />
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
