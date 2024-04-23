import { useCallback, useRef, useState } from 'react';

import { Block } from '@stacks/blockchain-api-client';

import { EnhancedBlock, UIBlockType } from '../types';
import { useSubscribeBlocks } from './useSubscribeBlocks';
import { useSubscribeBlocks2 } from './useSubscribeBlocks2';

// This file is temporary until we move onto the new naka UI
export function useBlockListWebSocketForUpdatedBlockList(
  liveUpdates: boolean,
  initialBlockHashes: Set<string>,
  initialBurnBlockHashes: Set<string>
) {
  const [latestBlocks, setLatestBlocks] = useState<EnhancedBlock[]>([]);
  const [latestBlock, setLatestBlock] = useState<EnhancedBlock>();
  const latestBlockHashes = useRef(new Set<string>());
  const latestBurnBlockHashes = useRef(new Set<string>());

  const handleBlock = useCallback(
    (block: Block) => {
      function updateLatestBlocks() {
        if (latestBlockHashes.current.has(block.hash) || initialBlockHashes.has(block.hash)) {
          return;
        }
        setLatestBlock({ ...block, microblock_tx_count: {}, animate: true });
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
            type: UIBlockType.Block,
            height: block.height,
            hash: block.hash,
            timestamp: block.burn_block_time,
            txsCount: block?.tx_count,
          },
          ...prevLatestBlocks,
        ]);
      }

      updateLatestBlocks();
    },
    [initialBurnBlockHashes, initialBlockHashes]
  );

  useSubscribeBlocks2(liveUpdates, handleBlock);

  const clearLatestBlocks = () => {
    setLatestBlocks([]);
  };

  return {
    latestUIBlocks: latestBlocks,
    latestBlock,
    latestBlocksCount: latestBlocks.filter(block => block.type === UIBlockType.Block).length,
    clearLatestBlocks,
  };
}
