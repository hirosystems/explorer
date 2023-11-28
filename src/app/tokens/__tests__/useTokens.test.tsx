import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

import { useSuspenseFtTokens as useSuspenseFtTokensActual } from '../../../common/queries/useFtTokens';
import { useSuspenseTokens } from '../useTokens';

const useSuspenseFtTokens = useSuspenseFtTokensActual as jest.MockedFunction<
  typeof useSuspenseFtTokensActual
>;

jest.mock('../../../common/queries/useFtTokens', () => ({
  useSuspenseFtTokens: jest.fn(() => ({})),
  useFtTokens: jest.fn(() => ({})),
}));

describe('useTokens', () => {
  const queryClient = new QueryClient();
  function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  beforeEach(() => {
    useSuspenseFtTokens.mockReturnValue({
      data: {
        pages: [
          {
            results: [],
          },
        ],
      },
    } as any);
    // (useSuspenseInfiniteQueryResult as jest.Mock).mockImplementation(
    //   response => response.data.pages[0].results
    // );
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useSuspenseTokens(''), { wrapper });

    expect(result.current.allFtTokensDeduped).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(false);
    expect(typeof result.current.loadMore).toBe('function');
  });

  it('returns deduped tokens', () => {
    const tokens = [
      { tx_id: 'token1', name: 'token1', symbol: 'token1' },
      { tx_id: 'token2', name: 'token2', symbol: 'token2' },
    ];

    useSuspenseFtTokens.mockReturnValue({
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
    } as any);

    const { result } = renderHook(() => useSuspenseTokens(''), { wrapper });
    expect(result.current.allFtTokensDeduped).toEqual(tokens);
  });
});
