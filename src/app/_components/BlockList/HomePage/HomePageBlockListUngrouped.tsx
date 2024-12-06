'use client';

import { Stack } from '@chakra-ui/react';
import { Suspense, useMemo } from 'react';

import { ListFooter } from '../../../../common/components/ListFooter';
import { useBlockListContext } from '../BlockListContext';
import { BlockListUngrouped } from '../Ungrouped/BlockListUngrouped';
import { HomePageBlockListUngroupedSkeleton } from '../Ungrouped/skeleton';
import { UpdateBar } from '../UpdateBar';
import { useHomePageBlockList } from '../data/useHomePageBlockList';

function HomePageBlockListUngroupedBase() {
  const { liveUpdates } = useBlockListContext();
  const { blockList, updateBlockList } = useHomePageBlockList();
  const latestBlock = useMemo(() => blockList?.[0], [blockList]);
  return (
    <>
      {!liveUpdates && <UpdateBar onClick={updateBlockList} latestBlock={latestBlock} />}
      <Stack gap={5}>
        <BlockListUngrouped blockList={blockList} stxBlocksLimit={3} minimized={true} />
        <ListFooter href={'/blocks'} label={'blocks'} />
      </Stack>
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
