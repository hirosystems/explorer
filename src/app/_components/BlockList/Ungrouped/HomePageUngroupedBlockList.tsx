'use client';

import { ListFooter } from '../../../../common/components/ListFooter';
import { Box } from '../../../../ui/Box';
import { useBlockListContext } from '../BlockListContext';
import { UpdateBar } from '../UpdateBar';
import { UngroupedBlockList } from './UngroupedBlocksList';
import { useUngroupedBlockListHomePage } from './useUngroupedBlockListHomePage';

// TODO: Create a layout component for this. It'll use the same one as
export function HomePageUngroupedBlockList() {
  const { liveUpdates } = useBlockListContext();
  const {
    latestBlocksCount: latestStxBlocksCountFromWebSocket,
    updateBlockList,
    blocksList,
  } = useUngroupedBlockListHomePage();
  console.log({ blocksList });

  return (
    <Box px={5}>
      {!liveUpdates && (
        <UpdateBar
          latestBlocksCount={latestStxBlocksCountFromWebSocket}
          onClick={updateBlockList}
        />
      )}
      <UngroupedBlockList ungroupedBlockList={blocksList} stxBlocksLimit={5} />
      <Box pt={4}>{!liveUpdates && <ListFooter href={'/blocks'} label={'blocks'} />}</Box>
    </Box>
  );
}
