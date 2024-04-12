import { useCallback, useEffect, useRef, useState } from 'react';

import { NakamotoBlock } from '@stacks/blockchain-api-client/src/generated/models';

import { useSubscribeBlocks } from './useSubscribeBlocks';

export function useBlockListWebSocket2(initialStxBlockHashes: Set<string>) {
  const [latestStxBlocks, setLatestStxBlocks] = useState<NakamotoBlock[]>([]);

  const stxBlockHashes = useRef(new Set<string>(initialStxBlockHashes));
  // update ref when initialStxBlockHashes changes
  useEffect(() => {
    stxBlockHashes.current = new Set(initialStxBlockHashes);
  }, [initialStxBlockHashes]);

  const handleBlock = useCallback((stxBlock: NakamotoBlock) => {
    // If the block is already in the list, don't add it again
    if (stxBlockHashes.current.has(stxBlock.hash)) {
      return;
    }

    // Otherwise, add it to the list
    setLatestStxBlocks(prevLatestStxBlocks => [stxBlock, ...prevLatestStxBlocks]);
    stxBlockHashes.current.add(stxBlock.hash);
  }, []);

  useSubscribeBlocks(handleBlock);
  // useSubscribeBlocks2(handleBlock);

  const clearLatestStxBlocks = () => {
    setLatestStxBlocks([]);
  };

  return {
    latestStxBlocks,
    latestStxBlocksCount: latestStxBlocks.length,
    clearLatestStxBlocks,
  };
}
