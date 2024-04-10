import { ReactNode } from 'react';

import { Stack } from '../../../../ui/Stack';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { FADE_DURATION } from '../consts';
import { BlockListBtcBlock, BlockListStxBlock } from '../types';
import { BtcBlockListItem } from './BtcBlockListItem';
import { StxBlocksGrid } from './StxBlockListItem';

export interface BlocksByBtcBlock {
  stxBlocks: BlockListStxBlock[];
  btcBlock: BlockListBtcBlock;
}

export type BlockListUngrouped = BlocksByBtcBlock[];

export function BlockListUngroupedLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack
      gap={0}
      width={'full'}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isBlockListLoading ? 0 : 1,
      }}
    >
      {children}
    </Stack>
  );
}

function StxBlocksGroupedByBtcBlock({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlocksByBtcBlock;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  const btcBlock = blockList.btcBlock;
  const stxBlocks = blockList.stxBlocks;
  const stxBlocksShortList = stxBlocksLimit
    ? blockList.stxBlocks.slice(0, stxBlocksLimit)
    : blockList.stxBlocks;

  return (
    <>
      <StxBlocksGrid key={btcBlock.hash} stxBlocks={stxBlocksShortList} minimized={minimized} />
      {stxBlocksLimit && stxBlocks.length > stxBlocksLimit && (
        <BlockCount count={stxBlocks.length - stxBlocksLimit} />
      )}
      <BtcBlockListItem
        key={btcBlock.hash}
        hash={btcBlock.hash}
        height={btcBlock.height}
        timestamp={btcBlock.timestamp}
      />
    </>
  );
}

export function BlockListUngrouped({
  blockList,
  stxBlocksLimit,
  minimized = false,
}: {
  blockList: BlockListUngrouped;
  stxBlocksLimit?: number;
  minimized?: boolean;
}) {
  return (
    <BlockListUngroupedLayout>
      {blockList.map(blocksGroupedByBtcBlock => (
        <StxBlocksGroupedByBtcBlock
          key={blocksGroupedByBtcBlock.btcBlock.hash}
          blockList={blocksGroupedByBtcBlock}
          stxBlocksLimit={stxBlocksLimit}
          minimized={minimized}
        />
      ))}
    </BlockListUngroupedLayout>
  );
}
