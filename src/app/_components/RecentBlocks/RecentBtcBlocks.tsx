import { HStack } from '@chakra-ui/react';

import { BurnBlock } from '@stacks/blockchain-api-client';
import { Block, NakamotoBlock } from '@stacks/stacks-blockchain-api-types';

import { BtcBlock, NewestBtcBlock } from './BtcBlock';
import { FadingOverlay } from './FadingOverlay';
import { BtcNewBlockPlaceholder } from './NewBlockPlaceholder';
import { BLOCK_HEIGHT } from './consts';

function isNewBlock(block: NakamotoBlock | Block, lastBlockHeight: number | undefined) {
  return block.burn_block_height > (lastBlockHeight || 0);
}

export function RecentBtcBlocks({
  btcBlocks,
  hasNewBlocks,
  handleUpdate,
}: {
  btcBlocks: BurnBlock[];
  hasNewBlocks: boolean;
  handleUpdate: () => void;
}) {
  if (!btcBlocks || btcBlocks.length <= 0) {
    return null;
  }

  return (
    <HStack h={BLOCK_HEIGHT} gap={3} align={'normal'} position={'relative'}>
      <BtcNewBlockPlaceholder hasNewBlocks={hasNewBlocks} handleUpdate={handleUpdate} />
      <HStack gap={1} align="stretch" minW={0} flex={1}>
        <NewestBtcBlock burnBlock={btcBlocks[0]} />
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
