import { useCallback, useRef, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { UIBlockType, UISingleBlock } from '../types';
import { useSubscribeBlocks2 } from './useSubscribeBlocks2';

export function useBlockListWebSocket(
  initialBlockHashes: Set<string>,
  initialBurnBlockHashes: Set<string>
) {
  const [latestBlocks, setLatestBlocks] = useState<UISingleBlock[]>([]);
  const [latestBlock, setLatestBlock] = useState<NakamotoBlock>();
  const latestBlockHashes = useRef(new Set<string>());
  const latestBurnBlockHashes = useRef(new Set<string>());

  const handleBlock = useCallback(
    (block: NakamotoBlock) => {
      function updateLatestBlocks() {
        // If the block is already in the list, don't add it again
        if (latestBlockHashes.current.has(block.hash) || initialBlockHashes.has(block.hash)) {
          return;
        }
        // Otherwise, add it to the list
        setLatestBlock(block);
        latestBlockHashes.current.add(block.hash);

        const isNewBurnBlock =
          !initialBurnBlockHashes.has(block.burn_block_hash) &&
          !latestBurnBlockHashes.current.has(block.burn_block_hash);
        if (isNewBurnBlock) {
          latestBurnBlockHashes.current.add(block.burn_block_hash);
          setLatestBlocks(prevLatestBlocks => [
            {
              type: UIBlockType.BurnBlock,
              height: block.burn_block_height,
              hash: block.burn_block_hash,
              timestamp: block.burn_block_time,
            },
            ...prevLatestBlocks,
          ]);
        }
        setLatestBlocks(prevLatestBlocks => [
          {
            type: UIBlockType.StxBlock,
            height: block.height,
            hash: block.hash,
            timestamp: block.burn_block_time,
            txsCount: block.tx_count,
          },
          ...prevLatestBlocks,
        ]);
      }

      updateLatestBlocks();
    },
    [initialBurnBlockHashes, initialBlockHashes]
  );

  useSubscribeBlocks2(handleBlock);

  const clearLatestBlocks = () => {
    setLatestBlocks([]);
  };

  return {
    latestUIBlocks: latestBlocks,
    latestBlock,
    latestBlocksCount: latestBlocks.filter(block => block.type === UIBlockType.StxBlock).length,
    clearLatestBlocks,
  };
}
