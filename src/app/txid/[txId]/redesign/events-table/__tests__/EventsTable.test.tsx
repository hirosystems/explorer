import { useBulkFtMetadata } from '@/common/queries/useBulkTokenMetadata';
import { useTxEventsById } from '@/common/queries/useTxEventsById';
import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { EventsTable } from '../EventsTable';

jest.mock('@/common/queries/useTxEventsById', () => ({
  ...jest.requireActual('@/common/queries/useTxEventsById'),
  useTxEventsById: jest.fn(),
}));
jest.mock('@/common/queries/useBulkTokenMetadata', () => ({ useBulkFtMetadata: jest.fn() }));
jest.mock('@/common/components/table/CommonTableCellRenderers', () => ({
  ...jest.requireActual('@/common/components/table/CommonTableCellRenderers'),
  AddressLinkCellRenderer: ({ address }: { address: string }) => <span>{address}</span>,
}));
jest.mock('../EventsTableCellRenderers', () => ({
  AssetEventTypeCellRenderer: ({ assetEventType }: { assetEventType: string }) => (
    <span>{assetEventType}</span>
  ),
  EventAmountCellRenderer: () => <span />,
}));

const mockUseTxEventsById = useTxEventsById as jest.MockedFunction<typeof useTxEventsById>;
const TX_ID = '0x01';
const PAGE_SIZE = 10;
const TOTAL_EVENTS = 25;

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => {
  window.scrollTo = jest.fn();
  jest.mocked(useBulkFtMetadata).mockReturnValue({ metadataMap: new Map() } as never);
  mockUseTxEventsById.mockImplementation((_txId, limit = PAGE_SIZE, cursor) => {
    const start = Number(cursor ?? 0);
    const count = Math.min(limit, TOTAL_EVENTS - start);
    return {
      data: {
        total: TOTAL_EVENTS,
        limit,
        cursor: { next: null, previous: null, current: cursor ?? null },
        results: Array.from({ length: count }, (_, i) => ({
          event_index: start + i,
          type: 'stx_asset',
          stx_asset: {
            type: 'transfer',
            sender: `SENDER${start + i}`,
            recipient: 'RECIPIENT',
            amount: '1',
            memo: null,
          },
        })),
      },
      isFetching: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useTxEventsById>;
  });
});

function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}

test('fetches each page of events from the cursor at its first event index', async () => {
  render(
    <Providers>
      <EventsTable txId={TX_ID} initialData={undefined} pageSize={PAGE_SIZE} />
    </Providers>
  );

  expect(mockUseTxEventsById).toHaveBeenLastCalledWith(
    TX_ID,
    PAGE_SIZE,
    undefined,
    expect.anything()
  );
  expect(screen.getByText('SENDER0')).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('Go to next page'));
  expect(await screen.findByText('SENDER10')).toBeInTheDocument();
  expect(mockUseTxEventsById).toHaveBeenLastCalledWith(TX_ID, PAGE_SIZE, '10', expect.anything());

  fireEvent.click(screen.getByLabelText('Go to next page'));
  expect(await screen.findByText('SENDER24')).toBeInTheDocument();
  expect(mockUseTxEventsById).toHaveBeenLastCalledWith(TX_ID, PAGE_SIZE, '20', expect.anything());
  // v3 reports the total, so the table knows there are exactly three pages.
  expect(screen.getByLabelText('Go to next page')).toBeDisabled();
});
