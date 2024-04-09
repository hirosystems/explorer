import { useCallback, useRef, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { UIBlockType, UISingleBlock } from '../types';
import { useSubscribeBlocks } from './useSubscribeBlocks';

export function useBlockListWebSocket(
  initialStxBlockHashes: Set<string>,
  initialBurnBlockHashes: Set<string>
) {
  const [latestBlocks, setLatestBlocks] = useState<UISingleBlock[]>([]); // TODO: convert to object structure so implementation isnt tied to one ui
  const [latestStxBlock, setLatestStxBlock] = useState<NakamotoBlock>();
  const latestStxBlockHashes = useRef(new Set<string>());
  const latestBurnBlockHashes = useRef(new Set<string>());

  const handleBlock = useCallback(
    (block: NakamotoBlock) => {
      function updateLatestBlocks() {
        // TODO: remove function
        // If the block is already in the list, don't add it again
        if (latestStxBlockHashes.current.has(block.hash) || initialStxBlockHashes.has(block.hash)) {
          return;
        }
        // Otherwise, add it to the list
        setLatestStxBlock(block);
        latestStxBlockHashes.current.add(block.hash);

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
    [initialBurnBlockHashes, initialStxBlockHashes]
  );

  useSubscribeBlocks(handleBlock);

  const clearLatestBlocks = () => {
    setLatestBlocks([]);
  };

  return {
    latestUIBlocks: latestBlocks,
    latestStxBlock: latestStxBlock,
    latestStxBlocksCount: latestBlocks.filter(block => block.type === UIBlockType.StxBlock).length,
    clearLatestBlocks,
  };
}
