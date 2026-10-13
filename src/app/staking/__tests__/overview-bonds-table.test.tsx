import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OverviewBondsTable, RewardHistoryNetwork } from '../OverviewBondsTable';
import { formatSbtc } from '../utils';
import fixture from './fixtures/bond.json';

const mockFetch = jest.fn();
const originalFetch = global.fetch;
const originalResizeObserver = global.ResizeObserver;
const bonds = Array.from({ length: 22 }, (_, i) => ({
  ...fixture,
  index: i + 1,
  status: 'closed',
}));
const props = {
  bonds,
  currentBurnHeight: 30000,
  nowMs: Date.now(),
  rewardHistoryNetwork: { chain: 'testnet' },
  rewardsByBond: { 22: BigInt(100000000) },
  settlementsByBond: { 22: [] },
};
const respond = (indexes: number[]) => ({
  ok: true,
  json: async () =>
    indexes.map(index => ({ index, rewardedSats: String(index * 100000000), settlements: [] })),
});

beforeEach(() => {
  mockFetch.mockReset();
  global.fetch = mockFetch;
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});
afterEach(() => {
  global.fetch = originalFetch;
  global.ResizeObserver = originalResizeObserver;
});

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const element = (network: RewardHistoryNetwork = props.rewardHistoryNetwork) => (
    <QueryClientProvider client={client}>
      <OverviewBondsTable {...props} rewardHistoryNetwork={network} />
    </QueryClientProvider>
  );
  return { ...renderWithChakraProviders(element()), element };
}

test('fetches only missing visible rewards, loads later pages, and reuses a cached page', async () => {
  mockFetch.mockImplementation(async url =>
    respond(new URL(url, 'http://localhost').searchParams.getAll('bond').map(Number))
  );
  const user = userEvent.setup();
  setup();
  await screen.findByText(formatSbtc(BigInt(2100000000)));
  expect(
    new URL(mockFetch.mock.calls[0][0], 'http://localhost').searchParams.getAll('bond')
  ).toEqual(['21', '20', '19', '18', '17', '16', '15', '14', '13']);
  expect(screen.getByText(formatSbtc(BigInt(100000000)))).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Go to next page' }));
  await screen.findByText(formatSbtc(BigInt(1200000000)));
  expect(mockFetch).toHaveBeenCalledTimes(2);
  expect(
    new URL(mockFetch.mock.calls[1][0], 'http://localhost').searchParams.getAll('bond')
  ).toEqual(['12', '11', '10', '9', '8', '7', '6', '5', '4', '3']);
  await user.click(screen.getByRole('button', { name: 'Go to previous page' }));
  await screen.findByText(formatSbtc(BigInt(2100000000)));
  expect(mockFetch).toHaveBeenCalledTimes(2);
});

test('failed history preserves known rewards and never displays missing rewards as zero', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 503 });
  setup();
  expect(await screen.findByText(/Some reward data could not be loaded/)).toBeInTheDocument();
  expect(screen.getByText(formatSbtc(BigInt(100000000)))).toBeInTheDocument();
  expect(screen.queryByText(formatSbtc(BigInt(0)))).not.toBeInTheDocument();
});

test('page changes cancel old requests and a late response cannot replace the current page', async () => {
  let finish!: (value: ReturnType<typeof respond>) => void;
  mockFetch.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        finish = resolve;
      })
  );
  mockFetch.mockResolvedValueOnce(respond([12]));
  const user = userEvent.setup();
  setup();
  await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
  const signal = mockFetch.mock.calls[0][1].signal;
  await user.click(screen.getByRole('button', { name: 'Go to next page' }));
  await screen.findByText(formatSbtc(BigInt(1200000000)));
  expect(signal.aborted).toBe(true);
  await act(async () => finish(respond([21])));
  expect(screen.queryByText(formatSbtc(BigInt(2100000000)))).not.toBeInTheDocument();
});

test('switching networks does not reuse the previous network’s reward cache', async () => {
  mockFetch.mockResolvedValue(respond([21]));
  const { rerender, element } = setup();
  await screen.findByText(formatSbtc(BigInt(2100000000)));
  rerender(element({ chain: 'mainnet' }));
  await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
  expect(mockFetch.mock.calls[1][0]).toContain('chain=mainnet');
  rerender(element({ chain: 'mainnet', api: 'https://another.example' }));
  await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3));
  expect(mockFetch.mock.calls[2][0]).toContain('api=https%3A%2F%2Fanother.example');
});
