import { css } from '@emotion/react';
import React from 'react';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { BlockListItem } from '@/appPages/components/BlockList/BlockListItem';
import { FoundResult, SearchResultType } from '@/common/types/search-results';
import { Box } from '@/ui/components';

interface BlockResultItemProps {
  result: FoundResult;
}

export function BlockResultItem({ result }: BlockResultItemProps) {
  if (!result || result.result.entity_type !== SearchResultType.BlockHash) return null;
  return (
    <Box px="20px">
      <BlockListItem
        block={
          {
            ...result.result.block_data,
            txs: [...Array.from({ length: result.result.tx_count })],
          } as Block
        }
        css={css`
          border: none;
        `}
      />
    </Box>
  );
}
