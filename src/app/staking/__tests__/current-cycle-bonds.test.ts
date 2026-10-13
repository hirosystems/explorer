import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import { fetchCurrentCycleBonds } from '../data';
import bond from './fixtures/bond.json';

jest.mock('@/api/stacksAPIFetch');
const fetchMock = jest.mocked(stacksAPIFetch);
const respond = (body: unknown) => ({ ok: true, json: async () => body }) as Response;

beforeEach(() => fetchMock.mockReset());

test('fetches only cycle-selected bond details from the selected API', async () => {
  fetchMock
    .mockResolvedValueOnce(respond({ bonds: { total: 2, indexes: [1, 2] } }))
    .mockResolvedValueOnce(respond({ ...bond, index: 1 }))
    .mockResolvedValueOnce(respond({ ...bond, index: 2 }));
  const result = await fetchCurrentCycleBonds('testnet', 'https://api.testnet.hiro.so');
  expect(result.map(bond => bond.index)).toEqual([1, 2]);
  expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
    'https://api.testnet.hiro.so/extended/v3/staking/cycles/current',
    'https://api.testnet.hiro.so/extended/v3/staking/bonds/1',
    'https://api.testnet.hiro.so/extended/v3/staking/bonds/2',
  ]);
});

test('an empty cycle produces zero active bonds without any detail requests', async () => {
  fetchMock.mockResolvedValueOnce(respond({ bonds: { total: 0, indexes: [] } }));
  await expect(fetchCurrentCycleBonds('mainnet')).resolves.toEqual([]);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test.each([
  undefined,
  { total: 2, indexes: [1] },
  { total: 2, indexes: [1, 1] },
  { total: 1, indexes: [0] },
  { total: 1, indexes: [1.5] },
])('rejects incomplete or invalid membership before loading details: %j', async bonds => {
  fetchMock.mockResolvedValueOnce(respond({ bonds }));
  await expect(fetchCurrentCycleBonds('mainnet')).rejects.toThrow(
    'Invalid current-cycle bond indexes'
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('an unavailable cycle does not become an empty active set', async () => {
  fetchMock.mockResolvedValueOnce({ ok: false, status: 503 } as Response);
  await expect(fetchCurrentCycleBonds('mainnet')).rejects.toThrow('503');
});

test.each([{ ok: false, status: 503 } as Response, respond({ ...bond, index: 3 })])(
  'a failed or mismatched detail response cannot produce partial totals',
  async response => {
    fetchMock
      .mockResolvedValueOnce(respond({ bonds: { total: 2, indexes: [1, 2] } }))
      .mockResolvedValueOnce(respond({ ...bond, index: 1 }))
      .mockResolvedValueOnce(response);
    await expect(fetchCurrentCycleBonds('mainnet')).rejects.toThrow();
  }
);
