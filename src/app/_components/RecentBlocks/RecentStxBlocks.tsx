import { UIStxBlock } from '@/app/data';
import { HStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { BurnBlock, NakamotoBlock } from '@stacks/stacks-blockchain-api-types';

import { FadingOverlay } from './FadingOverlay';
import { StacksNewBlockPlaceholder } from './NewBlockPlaceholder';
import { StxBlockGroup } from './StxBlock';
import { BLOCK_HEIGHT } from './consts';

export function RecentStxBlocks({
  stxBlocks,
  btcBlocks,
  hasNewBlocks,
  handleUpdate,
}: {
  stxBlocks: NakamotoBlock[];
  btcBlocks: BurnBlock[];
  hasNewBlocks: boolean;
  handleUpdate: () => void;
}) {
  // Group blocks by burn block height, and sort the groups by burn block height
  const stxBlocksByBurnBlockHeight = useMemo(() => {
    const groupedByBurnBlockHeight = stxBlocks.reduce(
      (acc, block) => {
        if (!acc[block.burn_block_height]) {
          acc[block.burn_block_height] = [];
        }
        acc[block.burn_block_height].push({ ...block, tx_count: block.tx_count });
        return acc;
      },
      {} as Record<number, UIStxBlock[]>
    );

    Object.keys(groupedByBurnBlockHeight).forEach(burnHeight => {
      groupedByBurnBlockHeight[Number(burnHeight)].sort((a, b) => b.height - a.height);
    });

    return groupedByBurnBlockHeight;
  }, [stxBlocks]);

  // Get the burn block heights in descending order
  const sortedBurnBlockHeights = useMemo(() => {
    return Object.keys(stxBlocksByBurnBlockHeight)
      .map(height => Number(height))
      .sort((a, b) => b - a);
  }, [stxBlocksByBurnBlockHeight]);

  // Get the total number of Stacks blocks for each burn block height
  const totalStxBlockCountByBurnBlockHeight = useMemo(() => {
    return Object.keys(stxBlocksByBurnBlockHeight).reduce(
      (acc, burnBlockHeight) => {
        const stxBlocksCount = btcBlocks?.find(
          block => block.burn_block_height === Number(burnBlockHeight)
        )?.stacks_blocks?.length;
        acc[Number(burnBlockHeight)] = stxBlocksCount || 0;
        return acc;
      },
      {} as Record<number, number>
    );
  }, [btcBlocks, stxBlocksByBurnBlockHeight]);

  // Get the height of the newest Stacks block
  const newestStxBlockHeight = useMemo(() => stxBlocks[0]?.height, [stxBlocks]);

  if (!stxBlocks || stxBlocks.length <= 0 || !btcBlocks || btcBlocks.length <= 0) {
    return null;
  }

  return (
    <HStack gap={3} h={BLOCK_HEIGHT} position={'relative'} align={'normal'} flexGrow={1}>
      <StacksNewBlockPlaceholder hasNewBlocks={hasNewBlocks} handleUpdate={handleUpdate} />
      <HStack gap={3} overflowX={'hidden'} align="stretch">
        {sortedBurnBlockHeights.map(burnBlockHeight => (
          <StxBlockGroup
            key={`burn-block-height-${burnBlockHeight}`}
            btcBlockHeight={burnBlockHeight}
            btcBlockTime={stxBlocksByBurnBlockHeight[burnBlockHeight][0].burn_block_time}
            stxBlocks={stxBlocksByBurnBlockHeight[burnBlockHeight]}
            newestStxBlockHeight={newestStxBlockHeight}
            totalStxBlockCount={totalStxBlockCountByBurnBlockHeight[burnBlockHeight]}
          />
        ))}
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
