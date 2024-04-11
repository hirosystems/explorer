'use client';

import { Suspense } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Flex } from '../../../../ui/Flex';
import { useBlockListContext } from '../BlockListContext';
import { BlockListUngrouped } from '../Ungrouped/BlockListUngrouped';
import { HomePageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useHomePageBlockList } from '../data/useHomePageBlockList';

function HomePageBlockListUngroupedBase() {
  const { liveUpdates } = useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
  } = useHomePageBlockList();
  return (
    <>
      {!liveUpdates && (
        <UpdateBar
          latestBlocksCount={latestStxBlocksCountFromWebSocket}
          onClick={updateBlockList}
          marginX={0}
        />
      )}
      <Flex flexDirection="column" gap={4} px={6}>
        <BlockListUngrouped blockList={blockList} stxBlocksLimit={5} minimized={true} />
        {!liveUpdates && <ListFooter href={'/blocks'} label={'blocks'} />}
      </Flex>
    </>
  );
}

export function HomePageBlockListUngrouped() {
  return (
    <Suspense fallback={<HomePageBlockListUngroupedSkeleton />}>
      <HomePageBlockListUngroupedBase />
    </Suspense>
  );
}
