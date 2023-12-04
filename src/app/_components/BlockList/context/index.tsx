'use client';

import { ReactNode, createContext } from 'react';

import { Block } from '@stacks/stacks-blockchain-api-types';

import { useSuspenseInfiniteQueryResult } from '../../../../common/hooks/useInfiniteQueryResult';
import { useSuspenseBlockListInfinite } from '../../../../common/queries/useBlockListInfinite';
import { EnhancedBlock } from '../types';
import { useLatestBlocks } from '../useLatestBlocks';

interface BurnBlock {
  height: number;
  hash: string;
  timestamp: number;
}

interface BlocksGroupedByBurnBlockHeight {
  burnBlock: BurnBlock;
  blocks: Block[];
}
interface BlockListContextProps {
  blocksGroupedByBurnBlockHeight: BlocksGroupedByBurnBlockHeight[];
  latestBlocks: EnhancedBlock[];
  resetLatestBlocks: () => void;
}

export const BlockListContext = createContext<BlockListContextProps>({
  blocksGroupedByBurnBlockHeight: [],
  latestBlocks: [],
  resetLatestBlocks: () => {},
});

function getBurnBlocks(blocks: Block[]) {
  return blocks.reduce(
    (acc, block) => {
      acc[block.burn_block_height] = {
        height: block.burn_block_height,
        hash: block.burn_block_hash,
        timestamp: block.burn_block_time,
      };
      return acc;
    },
    {} as Record<number, BurnBlock>
  );
}

function getBlocksGroupedByBurnBlock(blocks: Block[]) {
  return blocks.reduce((acc, block) => {
    const burnBlockHeight = block.burn_block_height;
    const burnBlock = acc.find(b => b.burnBlock.height === burnBlockHeight);
    if (burnBlock) {
      burnBlock.blocks.push(block);
    } else {
      acc.push({
        burnBlock: {
          height: burnBlockHeight,
          hash: block.burn_block_hash,
          timestamp: block.burn_block_time,
        },
        blocks: [block],
      });
    }
    return acc;
  }, [] as BlocksGroupedByBurnBlockHeight[]);
}

export function BlockListContextProvider({
  limit = 5,
  children,
}: {
  limit?: number;
  children: ReactNode;
}) {
  const response = useSuspenseBlockListInfinite();
  const blocks = useSuspenseInfiniteQueryResult<Block>(response, limit);
  const burnBlocks = getBurnBlocks(blocks);
  const blocksGroupedByBurnBlock = getBlocksGroupedByBurnBlock(blocks);

  const { latestBlocks, resetLatestBlocks } = useLatestBlocks();
  return (
    <BlockListContext.Provider
      value={{
        blocksGroupedByBurnBlockHeight: blocksGroupedByBurnBlock,
        latestBlocks,
        resetLatestBlocks,
      }}
    >
      {children}
    </BlockListContext.Provider>
  );
}
