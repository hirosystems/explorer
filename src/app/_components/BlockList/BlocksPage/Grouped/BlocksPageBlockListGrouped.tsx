'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Suspense } from 'react';

import { Section } from '../../../../../common/components/Section';
import { Box } from '../../../../../ui/Box';
import { Flex } from '../../../../../ui/Flex';
import { ExplorerErrorBoundary } from '../../../ErrorBoundary';
import { useBlockListContext } from '../../BlockListContext';
import { BlockListGrouped } from '../../Grouped/BlockListGrouped';
import { BlocksPageBlockListGroupedSkeleton } from '../../Grouped/skeleton';
import { UpdateBar } from '../../UpdateBar';
import { useBlocksPageBlockListGrouped } from './useBlocksPageBlockListGrouped';

function BlocksPageBlockListGroupedBase() {
  const { liveUpdates, isBlockListLoading } = useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBlocksPageBlockListGrouped(10);
  console.log({ liveUpdates });

  const enablePagination = true;

  return (
    <>
      {!liveUpdates && (
        <UpdateBar latestBlocksCount={latestBlocksCount} onClick={updateBlockList} />
      )}
      <Flex flexDirection="column" gap={4} pt={4}>
        <BlockListGrouped blockList={blockList} minimized={false} />
      </Flex>
      <Box pt={5} pb={5}>
        {(!liveUpdates || !enablePagination) && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            label={'blocks'}
          />
        )}
      </Box>
    </>
  );
}

export function BlocksPageBlockListGrouped() {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <Suspense fallback={<BlocksPageBlockListGroupedSkeleton />}>
        <BlocksPageBlockListGroupedBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
