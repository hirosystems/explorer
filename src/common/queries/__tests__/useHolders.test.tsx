import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { useApiClient } from '../../../api/useApiClient';
import { useHolders, useTokenSupply } from '../useHolders';

jest.mock('../../../api/useApiClient');
const mockUseApiClient = useApiClient as jest.MockedFunction<typeof useApiClient>;

const mockClient = { GET: jest.fn() } as any;

const ASSET_ID = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token';

const holdersPage = {
  limit: 20,
  total: 2,
  cursor: { next: null, previous: null, current: null },
  results: [{ principal: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', balance: '100' }],
};

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseApiClient.mockReturnValue(mockClient);
});

describe('useHolders', () => {
  it('reads STX holders from the v3 STX holders endpoint', async () => {
    mockClient.GET.mockResolvedValueOnce({ data: holdersPage, error: undefined });

    const { result } = renderHook(() => useHolders('stx', 20), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockClient.GET).toHaveBeenCalledWith('/extended/v3/tokens/stx/holders', {
      params: { query: { limit: 20 } },
    });
    expect(result.current.data).toEqual(holdersPage);
  });

  it('reads FT holders from the v3 FT holders endpoint, passing the cursor', async () => {
    mockClient.GET.mockResolvedValueOnce({ data: holdersPage, error: undefined });

    const { result } = renderHook(() => useHolders(ASSET_ID, 20, '100:SP000'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockClient.GET).toHaveBeenCalledWith(
      '/extended/v3/tokens/ft/{asset_identifier}/holders',
      {
        params: { path: { asset_identifier: ASSET_ID }, query: { limit: 20, cursor: '100:SP000' } },
      }
    );
  });
});

describe('useTokenSupply', () => {
  it('returns the v3 STX supply total for STX', async () => {
    mockClient.GET.mockResolvedValueOnce({
      data: { total: '1874370687477029', projected_total_2050: '2318000000000000' },
      error: undefined,
    });

    const { result } = renderHook(() => useTokenSupply('stx'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockClient.GET).toHaveBeenCalledWith('/extended/v3/tokens/stx/supply', undefined);
    expect(result.current.data).toBe('1874370687477029');
  });

  it('returns the v3 FT supply total for a fungible token', async () => {
    mockClient.GET.mockResolvedValueOnce({
      data: { asset_identifier: ASSET_ID, total: '5000' },
      error: undefined,
    });

    const { result } = renderHook(() => useTokenSupply(ASSET_ID), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockClient.GET).toHaveBeenCalledWith(
      '/extended/v3/tokens/ft/{asset_identifier}/supply',
      { params: { path: { asset_identifier: ASSET_ID } } }
    );
    expect(result.current.data).toBe('5000');
  });
});
