import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import '../mocks';
import { useBlockList } from '../useBlockList';

const LAST_BURN_BLOCK_STX_BLOCKS_COUNT = 50;

jest.mock('../useBlockListWebSocket', () => ({
  useBlockListWebSocket: jest.fn().mockImplementation(() => ({
    latestUIBlocks: [],
    latestBlocksCount: 0,
    clearLatestBlocks: jest.fn(),
    latestBlock: undefined,
  })),
}));

jest.mock('../useInitialBlockList', () => ({
  useInitialBlockList: jest.fn().mockImplementation(() => ({
    lastBurnBlock: {
      burn_block_height: 1,
      burn_block_hash: 'hash1',
      burn_block_time: Date.now(),
      stacks_blocks: Array(LAST_BURN_BLOCK_STX_BLOCKS_COUNT).map((_, i) => `block${i + 1}`),
    },
    secondToLastBurnBlock: {
      burn_block_height: 2,
      burn_block_hash: 'hash2',
      burn_block_time: Date.now(),
      stacks_blocks: ['block4', 'block5', 'block6'],
    },
    lastBurnBlockStxBlocks: [...Array(LAST_BURN_BLOCK_STX_BLOCKS_COUNT)].map((_, i) => ({
      height: i + 1,
      hash: `block${i + 1}`,
      burn_block_time: Date.now(),
      tx_count: 10,
    })),
    secondToLastBlockStxBlocks: [
      {
        height: 101,
        hash: 'oldBlock1',
        burn_block_time: Date.now(),
        tx_count: 25,
      },
      {
        height: 102,
        hash: 'oldBlock2',
        burn_block_time: Date.now(),
        tx_count: 25,
      },
      {
        height: 103,
        hash: 'oldBlock3',
        burn_block_time: Date.now(),
        tx_count: 25,
      },
    ],
  })),
}));

describe('useBlockList', () => {
  it('returns a block list of the correct length', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const length = 4;

    const { result } = renderHook(() => useBlockList(length), { wrapper });

    // wait 5 seconds
    await waitFor(() => {
      expect(result.current.blockList).toHaveLength(length);
      const countBlock = result.current.blockList.find(block => block.type === 'count') as any;
      /* In this case, we have sufficient blocks in the last burn block to satisfy the length,
      the list should look like this:
      [
        { type: 'block', height: 1, ... },
        { type: 'block', height: 2, ... },
        { type: 'count', count: 48 } <- (50 - 2 visible blocks)
        { type: 'burnBlock', ... },
       */
      expect(countBlock.count).toBe(LAST_BURN_BLOCK_STX_BLOCKS_COUNT - 2);
    });
  });
});
