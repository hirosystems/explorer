import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, act } from '@testing-library/react-hooks';
import { useTokens } from '../useTokens';
import { FC } from 'react';
import { useInfiniteQueryResult } from '@/app/common/hooks/useInfiniteQueryResult';
import { useFtTokens } from '@/app/tokens/useFtTokens';

jest.mock('@/app/tokens/useFtTokens');
jest.mock('@/app/common/hooks/useInfiniteQueryResult');

describe('useTokens', () => {
  const queryClient = new QueryClient();
  const wrapper: FC = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    (useFtTokens as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            results: [],
          },
        ],
      },
    });
    (useInfiniteQueryResult as jest.Mock).mockImplementation(
      response => response.data.pages[0].results
    );
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useTokens(), { wrapper });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.allFtTokensDeduped).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
    expect(typeof result.current.loadMore).toBe('function');
  });

  it('updates searchTerm correctly', () => {
    const { result } = renderHook(() => useTokens(), { wrapper });

    act(() => {
      result.current.setSearchTerm('new term');
    });
    expect(result.current.searchTerm).toBe('new term');
  });

  it('returns deduped tokens', () => {
    const tokens = [
      { tx_id: 'token1', name: 'token1', symbol: 'token1' },
      { tx_id: 'token2', name: 'token2', symbol: 'token2' },
    ];

    (useFtTokens as jest.Mock).mockImplementationOnce(params => {
      return {
        data: {
          pages: [
            {
              results: [
                ...tokens,
                tokens[0], // duplicate token
              ],
            },
          ],
        },
      };
    });

    const { result } = renderHook(() => useTokens(), { wrapper });
    expect(result.current.allFtTokensDeduped).toEqual(tokens);
  });
});
