import React from 'react';

import { Icon } from '../../../../ui/Icon';
import { Stack } from '../../../../ui/Stack';
import { StxIcon } from '../../../../ui/icons';
import { UIBlock, UIBlockType } from '../types';
import { BlockCount } from './BlockCount';
import { BurnBlock } from './BurnBlock';
import { StxBlock } from './StxBlock';
import { FADE_DURATION } from './consts';

export function Blocks({
  blockList,
  isUpdateListLoading,
}: {
  blockList: UIBlock[];
  isUpdateListLoading: boolean;
}) {
  return (
    <Stack
      pl={4}
      pr={2}
      gap={0}
      width={'full'}
      style={{
        transition: `opacity ${FADE_DURATION / 1000}s`,
        opacity: isUpdateListLoading ? 0 : 1,
      }}
    >
      {blockList.map((block, i) => {
        switch (block.type) {
          case UIBlockType.Block:
            const isFirstStxBlockInBurnBlock =
              i === 0 || (i > 0 && blockList[i - 1].type === UIBlockType.BurnBlock);
            return (
              <StxBlock
                key={block.hash}
                hash={block.hash}
                height={block.height}
                timestamp={block.timestamp}
                txsCount={block.txsCount}
                icon={
                  isFirstStxBlockInBurnBlock ? (
                    <Icon as={StxIcon} size={2.5} color={'white'} />
                  ) : undefined
                }
              />
            );
          case UIBlockType.BurnBlock:
            return (
              <BurnBlock
                key={block.hash}
                hash={block.hash}
                height={block.height}
                timestamp={block.timestamp}
              />
            );
          case UIBlockType.Count:
            return <BlockCount key={block.count} count={block.count} />;
        }
      })}
    </Stack>
  );
}
