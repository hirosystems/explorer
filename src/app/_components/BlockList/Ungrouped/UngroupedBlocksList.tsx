import { ReactNode } from 'react';

import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { StxIcon } from '../../../../ui/icons';
import { BlockCount } from '../BlockCount';
import { useBlockListContext } from '../BlockListContext';
import { FADE_DURATION } from '../consts';
import { BlockListBtcBlock, BlockListStxBlock } from '../types';
import { BtcBlockListItem } from './BtcBlockListItem';
import { StxBlockListItem } from './StxBlockListItem';

export interface BlocksByBtcBlock {
  stxBlocks: BlockListStxBlock[];
  btcBlock: BlockListBtcBlock;
}

export type UngroupedBlockList = BlocksByBtcBlock[]; // Ironic the ungrouped block list is grouped by btc block...

export function UngroupedBlockListLayout({ children }: { children: ReactNode }) {
  const { isBlockListLoading } = useBlockListContext();

  return (
    <Stack
      pl={4}
      pr={2}
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

function BlocksGroupedByBtcBlock({
  blocks,
  stxBlocksLimit,
}: {
  blocks: BlocksByBtcBlock;
  stxBlocksLimit?: number;
}) {
  const btcBlock = blocks.btcBlock;
  const stxBlocks = blocks.stxBlocks;
  const stxBlocksShortList = stxBlocksLimit
    ? blocks.stxBlocks.slice(0, stxBlocksLimit)
    : blocks.stxBlocks;

  return (
    <>
      {stxBlocksShortList.map((block, i) => (
        <StxBlockListItem
          key={block.hash}
          hash={block.hash}
          height={block.height}
          timestamp={block.timestamp}
          txsCount={block.txsCount}
          icon={i === 0 ? <Icon as={StxIcon} size={2.5} color={'white'} /> : undefined}
          hasBorder={i < stxBlocks.length - 1}
        />
      ))}
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

export function UngroupedBlockList({
  ungroupedBlockList,
  stxBlocksLimit,
}: {
  ungroupedBlockList: UngroupedBlockList;
  stxBlocksLimit?: number;
}) {
  return (
    <UngroupedBlockListLayout>
      {ungroupedBlockList.map((blocksGroupedByBtcBlock, i) => (
        <BlocksGroupedByBtcBlock
          key={blocksGroupedByBtcBlock.btcBlock.hash}
          blocks={blocksGroupedByBtcBlock}
          stxBlocksLimit={stxBlocksLimit}
        />
      ))}
    </UngroupedBlockListLayout>
  );
}
