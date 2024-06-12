'use client';

import { Suspense } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Flex } from '../../../../ui/Flex';
import { useBlockListContext } from '../BlockListContext';
import { BlockListGrouped } from '../Grouped/BlockListGrouped';
import { HomePageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useHomePageBlockList } from '../data/useHomePageBlockList';

function HomePageBlockListGroupedBase() {
  const { liveUpdates } = useBlockListContext();
  const { blockList, updateBlockList } = useHomePageBlockList();
  return (
    <>
      {!liveUpdates && <UpdateBar onClick={updateBlockList} />}
      <Flex flexDirection="column" pt={5} gap={4}>
        <BlockListGrouped blockList={blockList} minimized={true} stxBlocksLimit={3} />
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
