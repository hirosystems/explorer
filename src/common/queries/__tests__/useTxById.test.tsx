import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

import { useApiClient } from '../../../api/useApiClient';
import { useTxById } from '../useTxById';
import { useTxEventsById } from '../useTxEventsById';

jest.mock('../../../api/useApiClient');
const mockUseApiClient = useApiClient as jest.MockedFunction<typeof useApiClient>;

const mockClient = { GET: jest.fn() } as any;
const TX_ID = '0xa3a507295688f791c5e4e78ba2d293bd8c415f1232357f82f539410c5ae20dd1';

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

test('useTxById reads the v3 transaction with the fields the page renders', async () => {
  mockClient.GET.mockResolvedValueOnce({ data: { tx_id: TX_ID }, error: undefined });

  const { result } = renderHook(() => useTxById(TX_ID), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockClient.GET).toHaveBeenCalledWith('/extended/v3/transactions/{tx_id}', {
    params: {
      path: { tx_id: TX_ID },
      query: { include: ['function_args', 'post_conditions', 'result'] },
    },
  });
});

test('useTxEventsById reads a page of v3 events from the given cursor', async () => {
  const page = {
    total: 25,
    limit: 10,
    cursor: { next: '20', previous: '0', current: '10' },
    results: [],
  };
  mockClient.GET.mockResolvedValueOnce({ data: page, error: undefined });

  const { result } = renderHook(() => useTxEventsById(TX_ID, 10, '10'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockClient.GET).toHaveBeenCalledWith('/extended/v3/transactions/{tx_id}/events', {
    params: { path: { tx_id: TX_ID }, query: { limit: 10, cursor: '10' } },
  });
  expect(result.current.data).toEqual(page);
});

test('useTxEventsById omits the cursor for the first page', async () => {
  mockClient.GET.mockResolvedValueOnce({ data: { results: [] }, error: undefined });

  const { result } = renderHook(() => useTxEventsById(TX_ID, 10), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(mockClient.GET.mock.calls[0][1].params.query).toEqual({ limit: 10 });
});
