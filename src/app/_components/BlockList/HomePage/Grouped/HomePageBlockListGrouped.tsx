'use client';

import { Suspense } from 'react';

import { ListFooter } from '../../../../../common/components/ListFooter';
import { Flex } from '../../../../../ui/Flex';
import { useBlockListContext } from '../../BlockListContext';
import { BlockListGrouped } from '../../Grouped/BlockListGrouped';
import { HomePageBlockListGroupedSkeleton } from '../../Grouped/skeleton';
import { UpdateBar } from '../../UpdateBar';
import { useHomePageBlockListGrouped } from './useHomePageBlockListGrouped';

function HomePageBlockListGroupedBase() {
  const { liveUpdates, isBlockListLoading } = useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
  } = useHomePageBlockListGrouped();

  return (
    <>
      {!liveUpdates && (
        <UpdateBar
          latestBlocksCount={latestStxBlocksCountFromWebSocket}
          onClick={updateBlockList}
          marginX={0}
        />
      )}
      <Flex flexDirection="column" px={6} py={4} gap={4}>
        <BlockListGrouped blockList={blockList} />
        {!liveUpdates && <ListFooter href={'/blocks'} label={'blocks'} />}
      </Flex>
    </>
  );
}

export function HomePageBlockListGrouped() {
  return (
    <Suspense fallback={<HomePageBlockListGroupedSkeleton />}>
      <HomePageBlockListGroupedBase />
    </Suspense>
  );
}
