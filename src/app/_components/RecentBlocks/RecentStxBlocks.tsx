import { useHomePageData } from '@/app/context';
import { UIStxBlock } from '@/app/data';
import { BLOCK_LIST_QUERY_KEY, useBlockList } from '@/common/queries/useBlockListInfinite';
import { HStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';

import { FadingOverlay } from './FadingOverlay';
import { NewBlockPlaceholder } from './NewBlockPlaceholder';
import { StxBlockGroup } from './StxBlock';
import { BLOCK_HEIGHT, RECENT_STX_BLOCKS_COUNT } from './consts';

export function RecentStxBlocks() {
  const { initialRecentBlocks } = useHomePageData();
  const recentStxBlocks = initialRecentBlocks?.stxBlocks;
  const recentBtcBlocks = initialRecentBlocks?.btcBlocks;
  const queryClient = useQueryClient();
  const isCacheSetWithInitialData = useRef(false);

  if (isCacheSetWithInitialData.current === false && recentStxBlocks) {
    const queryKey = [BLOCK_LIST_QUERY_KEY, RECENT_STX_BLOCKS_COUNT];
    queryClient.setQueryData(queryKey, recentStxBlocks);
    isCacheSetWithInitialData.current = true;
  }

  const { data: stxBlocksData, refetch } = useBlockList(RECENT_STX_BLOCKS_COUNT, {
    manual: true,
  });
  const stxBlocks = stxBlocksData?.results || [];

  const stxBlocksByBurnBlockHeight = useMemo(() => {
    const groupedByBurnBlockHeight = stxBlocks.reduce(
      (acc, block) => {
        if (!acc[block.burn_block_height]) {
          acc[block.burn_block_height] = [];
        }
        acc[block.burn_block_height].push({ tx_count: block?.txs?.length || 0, ...block });
        return acc;
      },
      {} as Record<number, UIStxBlock[]>
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

  const totalStxBlockCountByBurnBlockHeight = useMemo(() => {
    return Object.keys(stxBlocksByBurnBlockHeight).reduce(
      (acc, burnBlockHeight) => {
        const stxBlocksCount = recentBtcBlocks?.results?.find(
          block => block.burn_block_height === Number(burnBlockHeight)
        )?.stacks_blocks?.length;
        acc[Number(burnBlockHeight)] = stxBlocksCount || 0;
        return acc;
      },
      {} as Record<number, number>
    );
  }, [recentBtcBlocks]);

  const newestStxBlockHeight = stxBlocks[0]?.height;

  if (!newestStxBlockHeight) {
    return null;
  }

  return (
    <HStack gap={3} h={BLOCK_HEIGHT} position={'relative'} align={'normal'} flexGrow={1}>
      <NewBlockPlaceholder
        newestBlockHeight={newestStxBlockHeight || Infinity}
        isNewBlock={(block, lastBlockHeight) => {
          return block.height > lastBlockHeight;
        }}
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
            totalStxBlockCount={totalStxBlockCountByBurnBlockHeight[burnBlockHeight]}
          />
        ))}
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
