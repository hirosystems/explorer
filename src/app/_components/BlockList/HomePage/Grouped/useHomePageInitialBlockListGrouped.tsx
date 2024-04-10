import { BurnBlock } from '@stacks/blockchain-api-client';

import { useSuspenseInfiniteQueryResult } from '../../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlocksByBurnBlock } from '../../../../../common/queries/useBlocksByBurnBlock';
import { useSuspenseBurnBlocks } from '../../../../../common/queries/useBurnBlocksInfinite';

const BURN_BLOCK_LENGTH = 3;
const STX_BLOCK_LENGTH = 3;

export function useHomePageInitialBlockListGrouped() {
  const burnBlocks = useSuspenseInfiniteQueryResult<BurnBlock>(
    useSuspenseBurnBlocks(BURN_BLOCK_LENGTH),
    BURN_BLOCK_LENGTH
  );

  const latestBurnBlock = burnBlocks[0];
  const secondLatestBurnBlock = burnBlocks[1];
  const thirdLatestBurnBlock = burnBlocks[2];

  const latestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(latestBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );
  const secondLatestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(secondLatestBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );
  const thirdLatestBurnBlockStxBlocks = useSuspenseInfiniteQueryResult(
    useSuspenseBlocksByBurnBlock(thirdLatestBurnBlock.burn_block_height, STX_BLOCK_LENGTH),
    STX_BLOCK_LENGTH
  );

  return {
    latestBurnBlock,
    latestBurnBlockStxBlocks,
    secondLatestBurnBlock,
    secondLatestBurnBlockStxBlocks,
    thirdLatestBurnBlock,
    thirdLatestBurnBlockStxBlocks,
  };
}
