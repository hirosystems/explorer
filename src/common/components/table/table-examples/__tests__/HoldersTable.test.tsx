import { useHolders } from '@/common/queries/useHolders';
import { system } from '@/ui/theme/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { HoldersTable } from '../HoldersTable';

jest.mock('@/common/queries/useHolders', () => ({
  ...jest.requireActual('@/common/queries/useHolders'),
  useHolders: jest.fn(),
}));
jest.mock('@/common/components/table/CommonTableCellRenderers', () => ({
  AddressLinkCellRenderer: ({ address }: { address: string }) => <span>{address}</span>,
  IndexCellRenderer: ({ index }: { index: number }) => <span>{index}</span>,
  EllipsisText: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

const mockUseHolders = useHolders as jest.MockedFunction<typeof useHolders>;

// Three pages of one holder each, linked by `cursor.next`.
const PAGES: Record<string, { principal: string; next: string | null }> = {
  first: { principal: 'SP1HOLDER', next: 'cursor-2' },
  'cursor-2': { principal: 'SP2HOLDER', next: 'cursor-3' },
  'cursor-3': { principal: 'SP3HOLDER', next: null },
};

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

beforeEach(() => {
  window.scrollTo = jest.fn();
  mockUseHolders.mockImplementation((_assetId, limit, cursor) => {
    const page = PAGES[cursor ?? 'first'];
    return {
      data: {
        limit,
        total: 3,
        cursor: { next: page.next, previous: null, current: cursor ?? null },
        results: [{ principal: page.principal, balance: '1000000' }],
      },
      isFetching: false,
      isLoading: false,
    } as unknown as ReturnType<typeof useHolders>;
  });
});

function renderTable() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ChakraProvider value={system}>
        <HoldersTable assetId="stx" totalSupply={3000000} decimals={6} pageSize={1} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

test('pages through holders with v3 cursors and shows previous/next only', async () => {
  renderTable();

  expect(screen.getByText('SP1HOLDER')).toBeInTheDocument();
  expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  expect(screen.queryByLabelText('Go to page number')).not.toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('Go to next page'));
  expect(await screen.findByText('SP2HOLDER')).toBeInTheDocument();
  expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  expect(mockUseHolders).toHaveBeenLastCalledWith('stx', 1, 'cursor-2', expect.anything());

  fireEvent.click(screen.getByLabelText('Go to next page'));
  expect(await screen.findByText('SP3HOLDER')).toBeInTheDocument();
  expect(mockUseHolders).toHaveBeenLastCalledWith('stx', 1, 'cursor-3', expect.anything());

  fireEvent.click(screen.getByLabelText('Go to previous page'));
  expect(await screen.findByText('SP2HOLDER')).toBeInTheDocument();
  expect(mockUseHolders).toHaveBeenLastCalledWith('stx', 1, 'cursor-2', expect.anything());

  fireEvent.click(screen.getByLabelText('Go to previous page'));
  expect(await screen.findByText('SP1HOLDER')).toBeInTheDocument();
  expect(mockUseHolders).toHaveBeenLastCalledWith('stx', 1, undefined, expect.anything());
});
