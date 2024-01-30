import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import '../mocks';
import { usePaginatedBlockList } from '../usePaginatedBlockList';

jest.mock('../useInitialBlockList', () => ({
  useInitialBlockList: jest.fn().mockImplementation(() => ({
    lastBurnBlock: {
      burn_block_height: 1,
      burn_block_hash: 'hash1',
      burn_block_time: Date.now(),
      stacks_blocks: Array(50).map((_, i) => `block${i + 1}`),
    },
    secondToLastBurnBlock: {
      burn_block_height: 2,
      burn_block_hash: 'hash2',
      burn_block_time: Date.now(),
      stacks_blocks: ['block4', 'block5', 'block6'],
    },
  })),
}));

describe('usePaginatedBlockList', () => {
  const queryClient = new QueryClient();

  it('should have the correct initial state', () => {
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => usePaginatedBlockList(), { wrapper });

    waitFor(() => {
      expect(result.current.initialBlockList).toEqual([]);
      expect(result.current.initialBurnBlocks).toEqual({});
      expect(result.current.isFetchingNextPage).toBe(false);
      expect(result.current.hasNextPage).toBeUndefined();
    });
  });

  it('should reset queries when updateList is called', async () => {
    const wrapper = ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => usePaginatedBlockList(), { wrapper });

    const resetQuerySpy = jest.spyOn(queryClient, 'resetQueries');

    act(() => {
      waitFor(() => {
        result.current.updateList();
      });
    });

    waitFor(() => {
      expect(resetQuerySpy).toHaveBeenCalledWith({ queryKey: ['blockListInfinite'] });
    });
  });
});
