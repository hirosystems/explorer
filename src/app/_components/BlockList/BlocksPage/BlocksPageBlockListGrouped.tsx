'use client';

import { Suspense, useMemo } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { useBlockListContext } from '../BlockListContext';
import { BlockListGrouped } from '../Grouped/BlockListGrouped';
import { BlocksPageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useBlocksPageBlockListGrouped } from '../data/useBlocksPageBlockListGrouped';

function BlocksPageBlockListGroupedBase() {
  const { liveUpdates } = useBlockListContext();
  const { blockList, updateBlockList, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBlocksPageBlockListGrouped();
  const latestBlock = useMemo(() => blockList?.[0], [blockList]);

  return (
    <>
      {!liveUpdates && <UpdateBar onClick={updateBlockList} latestBlock={latestBlock} />}
      <Flex flexDirection="column" gap={4} pt={4}>
        <BlockListGrouped blockList={blockList} minimized={false} stxBlocksLimit={undefined} />
      </Flex>
      <Box pt={5} pb={5}>
        <ListFooter
          isLoading={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          label={'blocks'}
        />
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
