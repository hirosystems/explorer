import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { BurnBlock } from '@stacks/blockchain-api-client';

export function generateBtcBlocksMap(btcBlocks: BurnBlock[]) {
  const map = {} as Record<string, BurnBlock>;
  btcBlocks.forEach(block => {
    map[block.burn_block_hash] = block;
  });
  return map;
}

export function useBtcBlocksMap(btcBlocks: BurnBlock[]) {
  return useMemo(() => {
    return generateBtcBlocksMap(btcBlocks);
  }, [btcBlocks]);
}

export function useRefetchInitialBlockList(queryKeys: string[][], callback?: () => void) {
  const queryClient = useQueryClient();

  return async function (callback: () => void) {
    await Promise.all(
      queryKeys.map(queryKey => queryClient.refetchQueries({ queryKey: queryKey }))
    );

    callback();
  };
}
