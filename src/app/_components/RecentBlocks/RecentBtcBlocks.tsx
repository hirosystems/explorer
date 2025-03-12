import { HStack } from '@chakra-ui/react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useBurnBlocks } from '../../../common/queries/useBurnBlocksInfinite';
import { BURN_BLOCKS_QUERY_KEY_EXTENSION } from '../BlockList/consts';
import { BtcBlock, NewestBtcBlock } from './BtcBlock';
import { FadingOverlay } from './FadingOverlay';
import { NewBlockPlaceholder } from './NewBlockPlaceholder';
import { BLOCK_HEIGHT } from './consts';

export function RecentBtcBlocks() {
  const response = useBurnBlocks(7, {}, BURN_BLOCKS_QUERY_KEY_EXTENSION);
  const { refetch } = response;
  const btcBlocks = useInfiniteQueryResult<BurnBlock>(response);
  const newestBtcBlock = btcBlocks[0];
  if (!newestBtcBlock) {
    return null;
  }
  return (
    <HStack h={BLOCK_HEIGHT} gap={3} align={'normal'} position={'relative'}>
      <NewBlockPlaceholder
        newestBtcBlockHeight={newestBtcBlock?.burn_block_height || Infinity}
        refetch={refetch}
        border="1px dashed var(--stacks-colors-accent-bitcoin-500)"
        boxShadow={'0px 4px 12px 0px rgba(255, 145, 0, 0.25)'}
      />
      <HStack gap={1} align="stretch" minW={0} flex={1}>
        <NewestBtcBlock burnBlock={newestBtcBlock} />
        <HStack gap={3} align="stretch" overflowX={'hidden'} minW={0}>
          {btcBlocks.slice(1).map(block => (
            <BtcBlock burnBlock={block} />
          ))}
        </HStack>
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
