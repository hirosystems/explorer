import { Box, HStack } from '@chakra-ui/react';

import { BurnBlock } from '@stacks/blockchain-api-client';

import { useInfiniteQueryResult } from '../../../common/hooks/useInfiniteQueryResult';
import { useBurnBlocks } from '../../../common/queries/useBurnBlocksInfinite';
import { BURN_BLOCKS_QUERY_KEY_EXTENSION } from '../BlockList/consts';
import { BtcBlock, NewestBtcBlock } from './BtcBlock';
import { NewBlockPlaceholder } from './NewBlockPlaceholder';

function FadingOverlay() {
  return (
    <Box
      flex={'0 0 auto'}
      w={['50px', '100px']}
      bg={'linear-gradient(to left, var(--stacks-colors-surface-tertiary) 0%, transparent 100%)'}
      position={'absolute'}
      top={0}
      bottom={0}
      right={0}
    />
  );
}

export function RecentBtcBlocks() {
  const response = useBurnBlocks(7, {}, BURN_BLOCKS_QUERY_KEY_EXTENSION);
  const { refetch } = response;
  const btcBlocks = useInfiniteQueryResult<BurnBlock>(response);
  const newestBtcBlock = btcBlocks[0];
  if (!newestBtcBlock) {
    return null;
  }
  return (
    <HStack gap={3} position={'relative'} overflowX={'hidden'} py={3} align={'normal'} pl={3}>
      <NewBlockPlaceholder
        newestBtcBlockHeight={newestBtcBlock?.burn_block_height || Infinity}
        refetch={refetch}
      />
      <HStack gap={1}>
        <NewestBtcBlock burnBlock={newestBtcBlock} />
        <HStack gap={3}>
          {btcBlocks.slice(1).map(block => (
            <BtcBlock burnBlock={block} />
          ))}
        </HStack>
      </HStack>
      <FadingOverlay />
    </HStack>
  );
}
