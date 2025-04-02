import { useHomePageData } from '@/app/home-redesign/context';
import { HStack } from '@chakra-ui/react';

import { useBurnBlocks } from '../../../common/queries/useBurnBlocksInfinite';
import { BtcBlock, NewestBtcBlock } from './BtcBlock';
import { FadingOverlay } from './FadingOverlay';
import { NewBlockPlaceholder } from './NewBlockPlaceholder';
import { BLOCK_HEIGHT, RECENT_BTC_BLOCKS_COUNT } from './consts';

export function RecentBtcBlocks() {
  const recentBtcBlocks = useHomePageData().initialRecentBlocks.btcBlocks;

  const { data: btcBlocksData, refetch } = useBurnBlocks(RECENT_BTC_BLOCKS_COUNT, undefined, {
    initialData: recentBtcBlocks,
    manual: true,
  });
  const btcBlocks = btcBlocksData?.results || [];
  const newestBtcBlock = btcBlocks[0];
  if (!newestBtcBlock) {
    return null;
  }

  return (
    <HStack h={BLOCK_HEIGHT} gap={3} align={'normal'} position={'relative'}>
      <NewBlockPlaceholder
        newestBlockHeight={newestBtcBlock?.burn_block_height || Infinity}
        isNewBlock={(block, lastBlockHeight) => {
          return block.burn_block_height > lastBlockHeight;
        }}
        refetch={refetch}
        border="1px dashed var(--stacks-colors-accent-bitcoin-500)"
        boxShadow={'0px 4px 12px 0px rgba(255, 145, 0, 0.25)'}
      />
      <HStack gap={1} align="stretch" minW={0} flex={1}>
        <NewestBtcBlock burnBlock={newestBtcBlock} />
        <HStack gap={3} align="stretch" overflowX={'hidden'} minW={0}>
          {btcBlocks.slice(1).map(block => (
            <BtcBlock key={block.burn_block_hash} burnBlock={block} />
          ))}
        </HStack>
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
