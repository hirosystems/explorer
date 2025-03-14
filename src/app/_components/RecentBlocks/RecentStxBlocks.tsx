import { useBlockListInfinite } from '@/common/queries/useBlockListInfinite';
import { HStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Block } from '@stacks/blockchain-api-client';

import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { FadingOverlay } from './FadingOverlay';
import { NewBlockPlaceholder } from './NewBlockPlaceholder';
import { StxBlockGroup } from './StxBlock';
import { BLOCK_HEIGHT } from './consts';

export function RecentStxBlocks() {
  const response = useBlockListInfinite(10);
  const { refetch } = response;
  const stxBlocks = useInfiniteQueryResult<Block>(response);

  const stxBlocksByBurnBlockHeight = useMemo(() => {
    const groupedByBurnBlockHeight = stxBlocks.reduce(
      (acc, block) => {
        if (!acc[block.burn_block_height]) {
          acc[block.burn_block_height] = [];
        }
        acc[block.burn_block_height].push(block);
        return acc;
      },
      {} as Record<number, Block[]>
    );

    Object.keys(groupedByBurnBlockHeight).forEach(burnHeight => {
      groupedByBurnBlockHeight[Number(burnHeight)].sort((a, b) => b.height - a.height);
    });

    return groupedByBurnBlockHeight;
  }, [stxBlocks]);

  const sortedBurnBlockHeights = useMemo(() => {
    return Object.keys(stxBlocksByBurnBlockHeight)
      .map(height => Number(height))
      .sort((a, b) => b - a);
  }, [stxBlocksByBurnBlockHeight]);

  const newestStxBlockHeight = stxBlocks[0]?.height;

  return (
    <HStack gap={3} h={BLOCK_HEIGHT} position={'relative'} align={'normal'} flexGrow={1}>
      <NewBlockPlaceholder
        newestBtcBlockHeight={newestStxBlockHeight || Infinity}
        refetch={refetch}
        border="1px dashed var(--stacks-colors-accent-stacks-500)"
        boxShadow={'0px 4px 12px 0px rgba(255, 85, 18, 0.25)'}
      />
      <HStack gap={3} overflowX={'hidden'} align="stretch">
        {sortedBurnBlockHeights.map(burnBlockHeight => (
          <StxBlockGroup
            key={`burn-block-height-${burnBlockHeight}`}
            btcBlockHeight={burnBlockHeight}
            btcBlockTime={stxBlocksByBurnBlockHeight[burnBlockHeight][0].burn_block_time}
            stxBlocks={stxBlocksByBurnBlockHeight[burnBlockHeight]}
            newestStxBlockHeight={newestStxBlockHeight}
          />
        ))}
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
