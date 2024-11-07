'use client';

import { Flex } from '@chakra-ui/react';
import { Suspense, useMemo } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { useBlockListContext } from '../BlockListContext';
import { BlockListGrouped } from '../Grouped/BlockListGrouped';
import { HomePageBlockListGroupedSkeleton } from '../Grouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useHomePageBlockList } from '../data/useHomePageBlockList';

function HomePageBlockListGroupedBase() {
  const { liveUpdates } = useBlockListContext();
  const { blockList, updateBlockList } = useHomePageBlockList();
  const latestBlock = useMemo(() => blockList?.[0], [blockList]);
  return (
    <>
      {!liveUpdates && <UpdateBar onClick={updateBlockList} latestBlock={latestBlock} />}
      <Flex flexDirection="column" pt={5} gap={4}>
        <BlockListGrouped blockList={blockList} minimized={true} stxBlocksLimit={3} />
        <ListFooter href={'/blocks'} label={'blocks'} />
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
