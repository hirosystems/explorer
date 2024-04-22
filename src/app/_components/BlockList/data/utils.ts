import { useQueryClient } from '@tanstack/react-query';

import { BurnBlock } from '@stacks/blockchain-api-client';

export function useBtcBlocksMap(btcBlocks: BurnBlock[]) {
  const map = {} as Record<string, BurnBlock>;
  btcBlocks.forEach(block => {
    map[block.burn_block_hash] = block;
  });
  return map;
}

export function useRefetchInitialBlockList(queryKeys: string[][], callback: () => void) {
  const queryClient = useQueryClient();

  return async function (callback: () => void) {
    await Promise.all(
      queryKeys.map(queryKey => queryClient.invalidateQueries({ queryKey: queryKey }))
    );

    await Promise.all(
      queryKeys.map(queryKey => queryClient.refetchQueries({ queryKey: queryKey }))
    );

    callback();
  };
}
