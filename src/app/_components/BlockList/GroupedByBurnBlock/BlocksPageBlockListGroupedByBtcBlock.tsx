'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Suspense } from 'react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { UpdateBar } from '../LayoutA/UpdateBar';
import { useBlockListContext } from '../LayoutA/context';
import { FADE_DURATION } from '../consts';
import { BurnBlockGroup } from './BurnBlockGroup';
import { BlocksPageBlockListGroupedByBtcBlockSkeleton } from './skeleton';
import { useBlockListGroupedByBtcBlockBlocksPage } from './useBlockListGroupedByBtcBlockBlocksPage';

function BlocksPageBlockListGroupedByBtcBlockBase() {
  const { liveUpdates, isBlockListLoading } = useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBlockListGroupedByBtcBlockBlocksPage(10);
  console.log({ liveUpdates });

  const enablePagination = true;

  return (
    <>
      {!liveUpdates && (
        <UpdateBar
          isUpdateListLoading={isBlockListLoading}
          latestBlocksCount={latestBlocksCount}
          onClick={updateBlockList}
        />
      )}
      <Flex
        flexDirection="column"
        gap={4}
        pt={4}
        style={{
          transition: `opacity ${FADE_DURATION / 1000}s`,
          opacity: isBlockListLoading ? 0 : 1,
        }}
      >
        {blockList.map(block => (
          <BurnBlockGroup
            key={block.burnBlock.hash}
            burnBlock={block.burnBlock}
            stxBlocks={block.stxBlocks}
            stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
          />
        ))}
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

export function BlocksPageBlockListGroupedByBtcBlock() {
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
      <Suspense fallback={<BlocksPageBlockListGroupedByBtcBlockSkeleton />}>
        <BlocksPageBlockListGroupedByBtcBlockBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
