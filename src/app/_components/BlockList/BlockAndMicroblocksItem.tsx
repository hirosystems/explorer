import React, { memo } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useVerticallyStackedElementsBorderStyle } from '../../../common/hooks/useVerticallyStackedElementsBorderStyle';
import { AccordionButton } from '../../../ui/AccordionButton';
import { AccordionIcon } from '../../../ui/AccordionIcon';
import { AccordionItem } from '../../../ui/AccordionItem';
import { AccordionPanel } from '../../../ui/AccordionPanel';
import { Flex } from '../../../ui/Flex';
import { Text } from '../../../ui/Text';
import { BlockListItem } from './BlockListItem';
import { MicroblockListItem } from './MicroblockListItem';

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
