import { BurnBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlocksByBurnBlock } from '../../../../common/queries/useBlocksByBurnBlock';
import { useSuspenseBurnBlocks } from '../../../../common/queries/useBurnBlocks';

const BURN_BLOCK_LENGTH = 2;
const STX_BLOCK_LENGTH = 20;

export function useInitialBlockList() {
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(
    useSuspenseBurnBlocks(BURN_BLOCK_LENGTH),
    BURN_BLOCK_LENGTH
  );

  const lastBurnBlock = burnBlocks[0];
  const secondToLastBurnBlock = burnBlocks[1];

  const lastBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(lastBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );
  const secondToLastBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(secondToLastBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );

  return {
    lastBurnBlock,
    secondToLastBurnBlock,
    lastBurnBlockStxBlocks,
    secondToLastBlockStxBlocks,
  };
}
