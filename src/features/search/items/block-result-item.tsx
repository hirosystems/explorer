import { BlockListItem } from '@/app/components/BlockList/BlockListItem';
import { FoundResult } from '@/common/types/search-results';
import { Box } from '@/ui/components';
import { css } from '@emotion/react';
import React from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

interface BlockResultItemProps {
  result: FoundResult;
}

export const BlockResultItem: React.FC<BlockResultItemProps> = ({ result }) => {
  if (!result || result.result.entity_type !== 'block_hash') return null;

  return (
    <Box px={'20px'}>
      <BlockListItem
        block={{ ...result.result.block_data, txs: [...Array(result.result.tx_count)] } as Block}
        css={css`
          border: none;
        `}
      />
    </Box>
  );
};
