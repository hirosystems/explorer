'use client';

import { Suspense } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { useBlockListContext } from '../BlockListContext';
import { UpdateBar } from '../UpdateBar';
import { FADE_DURATION } from '../consts';
import { BurnBlockGroup } from './BurnBlockGroup';
import { HomePageBlockListGroupedByBtcBlockSkeleton } from './skeleton';
import { useBlockListGroupedByBtcBlockHomePage } from './useBlockListGroupedByBtcBlockHomePage';

function HomePageBlockListGroupedByBtcBlockBase() {
  const { liveUpdates, isBlockListLoading } = useBlockListContext();
  const { blockList, updateBlockList, latestBlocksCount } = useBlockListGroupedByBtcBlockHomePage();

  return (
    <Box overflowX={'auto'}>
      {!liveUpdates && (
        <UpdateBar latestBlocksCount={latestBlocksCount} onClick={updateBlockList} marginX={0} />
      )}
      <Flex
        flexDirection="column"
        gap={4}
        py={4}
        px={5}
        style={{
          transition: `opacity ${FADE_DURATION / 1000}s`,
          opacity: isBlockListLoading ? 0 : 1,
        }}
      >
        {blockList.map(block => (
          <BurnBlockGroup
            minimized={true}
            burnBlock={block.burnBlock}
            stxBlocks={block.stxBlocks}
            stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
          />
        ))}
        {!liveUpdates && <ListFooter href={'/blocks'} label={'blocks'} />}
      </Flex>
    </Box>
  );
}

export function HomePageBlockListGroupedByBtcBlock() {
  return (
    <Suspense fallback={<HomePageBlockListGroupedByBtcBlockSkeleton />}>
      <HomePageBlockListGroupedByBtcBlockBase />
    </Suspense>
  );
}
