import { useGetBlocksByBurnBlockQuery } from '@/common/queries/useBlocksByBurnBlock';
import { useQueries } from '@tanstack/react-query';

export function useStxBlocksForBtcBlocks(
  btcBlocks: BurnBlock[],
  numStxBlocksperBtcBlock: number,
  btcBlocksRequiringStxBlocks?: boolean[]
) {
  const getQuery = useGetBlocksByBurnBlockQuery();

  const stxBlockQueries = btcBlocks.map((btcBlock, i) => {
    const isEnabled = !!btcBlocksRequiringStxBlocks && btcBlocksRequiringStxBlocks[i];

    return isEnabled
      ? getQuery(btcBlock.burn_block_height, numStxBlocksperBtcBlock)
      : {
          queryKey: ['stxBlocks', btcBlock.burn_block_height, 'disabled'],
          queryFn: () => Promise.resolve(null),
          enabled: false,
        };
  });

  const stxBlocksResults = useQueries({ queries: stxBlockQueries });
  return stxBlocksResults.map(result => result.data ?? null);
}
