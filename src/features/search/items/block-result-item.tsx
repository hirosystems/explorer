import React from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { BlockListItem } from '../../../app/_components/BlockList/BlockListItem';
import { FoundResult } from '../../../common/types/search-results';

interface BlockResultItemProps {
  result: FoundResult;
}

export const BlockResultItem: React.FC<BlockResultItemProps> = ({ result }) => {
  if (!result || result.result.entity_type !== 'block_hash') return null;

  return (
    <BlockListItem
      block={
        {
          ...result.result.block_data,
          txs: result.result?.metadata?.txs || [...Array(result.result.tx_count)],
        } as Block
      }
      p={0}
      css={{
        border: 'none',
      }}
      className={`search-bar-result-1`}
    />
  );
};
