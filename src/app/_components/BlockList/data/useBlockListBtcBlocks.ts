import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';

import { Block, BurnBlock, NakamotoBlock } from '@stacks/blockchain-api-client';

import { useGetBurnBlockQuery } from '../../../../common/queries/useBurnBlock';

// fetch the btc blocks for the stx blocks
export const useBlockListBtcBlocks = (latestStxBlocks: (Block | NakamotoBlock)[]) => {
  const accumulatedStxBlocksRef = useRef<Set<string>>(new Set());
  const btcBlocksHashesRef = useRef<Set<string>>(new Set());
  const btcBlocksRef = useRef<BurnBlock[]>([] as BurnBlock[]);

  useEffect(() => {
    if (latestStxBlocks.length > 0) {
      latestStxBlocks.forEach(block => {
        if (!accumulatedStxBlocksRef.current.has(block.burn_block_hash)) {
          accumulatedStxBlocksRef.current.add(block.burn_block_hash);
        }
      });
    }
  }, [latestStxBlocks]);

  const queryClient = useQueryClient();
  const getQuery = useGetBurnBlockQuery();
  const btcBlockQueries = useMemo(() => {
    const hashes = Array.from(accumulatedStxBlocksRef.current).filter(
      hash => !btcBlocksHashesRef.current.has(hash)
    );
    return {
      queries: hashes.map(hash => {
        return getQuery(hash);
      }),
      combine: (response: UseQueryResult<BurnBlock, Error>[]) => response.map(r => r.data),
    };
  }, [accumulatedStxBlocksRef, getQuery]);
  const btcBlocks = useQueries(btcBlockQueries, queryClient);
  const filteredBtcBlocks = btcBlocks.filter(block => !!block) as BurnBlock[];
  filteredBtcBlocks.forEach(block => {
    btcBlocksHashesRef.current.add(block.burn_block_hash);
  });
  btcBlocksRef.current = [...filteredBtcBlocks, ...btcBlocksRef.current];

  return { btcBlocks: btcBlocksRef.current };
};
