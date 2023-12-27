import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import {
  StacksApiWebSocketClient,
  connectWebSocketClient as connectWebSocketClientActual,
} from '@stacks/blockchain-api-client';
import { Block } from '@stacks/stacks-blockchain-api-types';

import { useSuspenseBlockListInfinite as useSuspenseBlockListInfiniteActual } from '../../../../common/queries/useBlockListInfinite';
import '../../../../common/utils/test-utils/matchMedia.mock';
import { BlocksList } from '../index';
import { EnhancedBlock } from '../types';

const useSuspenseBlockListInfinite = useSuspenseBlockListInfiniteActual as jest.MockedFunction<
  typeof useSuspenseBlockListInfiniteActual
>;

const connectWebSocketClient = connectWebSocketClientActual as jest.MockedFunction<
  typeof connectWebSocketClientActual
>;
jest.mock('../../../../common/api/useApi', () => ({
  useApi: jest.fn(),
}));

jest.mock('@stacks/blockchain-api-client', () => ({
  connectWebSocketClient: jest.fn(),
}));

jest.mock('../../../../common/queries/useBlockListInfinite', () => ({
  useSuspenseBlockListInfinite: jest.fn(() => ({})),
}));

window.scrollTo = jest.fn();

const LIMIT = 10;

const queryClient = new QueryClient();

describe('BlocksListBase component', () => {
  let mockSubscribeBlocksCallback: (event: Block) => any;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockClient = {
      subscribeBlocks: jest.fn(callback => {
        mockSubscribeBlocksCallback = callback;
        return {
          unsubscribe: async () => {
            await new Promise(res => setTimeout(res, 50));
          },
        };
      }),
    };

    connectWebSocketClient.mockResolvedValue(mockClient as unknown as StacksApiWebSocketClient);
  });

  it('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BlocksList limit={LIMIT} />
      </QueryClientProvider>
    );
  });

  it('toggles live view on switch click', async () => {
    useSuspenseBlockListInfinite.mockReturnValue({
      data: { pages: [{ results: [{ hash: '1' }, { hash: '2' }] }] },
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <BlocksList limit={LIMIT} />
      </QueryClientProvider>
    );

    const switchElement = screen.getByRole('checkbox', { name: /live view/i });
    expect(switchElement).toBeInTheDocument();

    act(() => {
      fireEvent.click(switchElement);
    });
    await waitFor(() => {
      expect(switchElement).toBeChecked();
    });
  });

  it('renders blocks from WebSocket correctly and removes old blocks', async () => {
    const mockResult = [
      { hash: '1', height: 1 },
      { hash: '2', height: 2 },
    ];

    useSuspenseBlockListInfinite.mockReturnValue({
      data: {
        pages: [
          {
            results: mockResult,
          },
        ],
      },
    } as any);

    render(
      <QueryClientProvider client={queryClient}>
        <BlocksList limit={LIMIT} />
      </QueryClientProvider>
    );

    const switchElement = screen.getByRole('checkbox', { name: /live view/i });

    act(() => {
      fireEvent.click(switchElement);
    });

    expect(switchElement).toBeChecked();

    const mockBlock = {
      hash: '3',
      height: 3,
    } as EnhancedBlock;

    await act(async () => {
      await Promise.resolve().then(() => mockSubscribeBlocksCallback(mockBlock));
    });

    // check if the new block is added to the list
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText(`#${mockBlock.height}`)).toBeInTheDocument();
    });

    // add more blocks to the list up to the limit
    await act(async () => {
      await Promise.all(
        Array.from(
          { length: LIMIT - mockResult.length - 1 },
          (_, i) => i + mockResult.length + 1
        ).map(i =>
          Promise.resolve().then(() => {
            mockSubscribeBlocksCallback({
              hash: `${i + 1}`,
              height: i + 1,
            } as EnhancedBlock);
          })
        )
      );
    });

    // check if first and last block are visible in the list
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#10')).toBeInTheDocument();
    });

    // add one more block to the list to trigger the removal of the oldest block
    await act(async () => {
      await Promise.resolve().then(() =>
        mockSubscribeBlocksCallback({
          hash: '11',
          height: 11,
        } as EnhancedBlock)
      );
    });

    // check if the first block is removed from the list
    await waitFor(() => {
      expect(screen.queryByText('#1')).not.toBeInTheDocument();
    });
  });
});
