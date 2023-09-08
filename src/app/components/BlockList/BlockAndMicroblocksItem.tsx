import { AccordionItem } from '@/ui/AccordionItem';
import { Flex } from '@/ui/Flex';
import { AccordionButton } from '@/ui/AccordionButton';
import { AccordionIcon } from '@/ui/AccordionIcon';
import { AccordionPanel } from '@/ui/AccordionPanel';
import { useVerticallyStackedElementsBorderStyle } from '@/app/common/styles/border';
import { MicroblockListItem } from './MicroblockListItem';
import { Text } from '@/ui/Text';
import React, { memo } from 'react';
import { Block } from '@stacks/blockchain-api-client';
import { BlockListItem } from './BlockListItem';

export const BlockAndMicroblocksItem: React.FC<{ block: Block }> = memo(
  ({ block }) => {
    return (
      <AccordionItem pl={'20px'} border={'none'}>
        <Flex gap={'6px'}>
          <BlockListItem block={block} data-test={`block-${block.hash}`} />
          <AccordionButton
            flexGrow={0}
            flexShrink={0}
            width={'30px'}
            ml={'auto'}
            p={0}
            justifyContent={'center'}
          >
            <AccordionIcon />
          </AccordionButton>
        </Flex>
        <AccordionPanel p={'0 30px 0 0'} css={useVerticallyStackedElementsBorderStyle}>
          {!!block.microblocks_accepted?.length ? (
            block.microblocks_accepted.map((microblockHash, microblockIndex) => (
              <MicroblockListItem
                blockTime={block.burn_block_time}
                hash={microblockHash}
                index={microblockIndex}
                key={microblockHash}
              />
            ))
          ) : (
            <Text fontSize={'14px'} p={'20px'} align={'center'}>
              No Microblocks
            </Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    );
  },
  (prevProps, currentProps) => prevProps.block.hash === currentProps.block.hash
);
