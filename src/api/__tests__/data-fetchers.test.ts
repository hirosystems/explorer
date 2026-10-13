/** @jest-environment node */
import { stacksAPIFetch, stacksAPIFetchJson } from '@/api/stacksAPIFetch';

import { fetchFtSupply, fetchHolders, fetchTx } from '../data-fetchers';

jest.mock('@/api/stacksAPIFetch', () => ({
  stacksAPIFetch: jest.fn(),
  stacksAPIFetchJson: jest.fn(),
}));

const fetchMock = stacksAPIFetch as jest.MockedFunction<typeof stacksAPIFetch>;
const fetchJsonMock = stacksAPIFetchJson as jest.MockedFunction<typeof stacksAPIFetchJson>;

const ASSET_ID = 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token::sbtc-token';
const ENCODED_ASSET_ID = encodeURIComponent(ASSET_ID);

beforeEach(() => jest.clearAllMocks());

test('fetchHolders reads the v3 FT holders endpoint', async () => {
  const page = { limit: 10, total: 0, cursor: {}, results: [] };
  fetchMock.mockResolvedValue(new Response(JSON.stringify(page)));

  await expect(fetchHolders('https://api.hiro.so', ASSET_ID, 10)).resolves.toEqual(page);
  expect(fetchMock.mock.calls[0][0]).toBe(
    `https://api.hiro.so/extended/v3/tokens/ft/${ENCODED_ASSET_ID}/holders?limit=10`
  );
});

test('fetchFtSupply reads the v3 FT supply endpoint', async () => {
  const supply = { asset_identifier: ASSET_ID, total: '5000' };
  fetchJsonMock.mockResolvedValue(supply);

  await expect(fetchFtSupply('https://api.hiro.so', ASSET_ID)).resolves.toEqual(supply);
  expect(fetchJsonMock.mock.calls[0][0]).toBe(
    `https://api.hiro.so/extended/v3/tokens/ft/${ENCODED_ASSET_ID}/supply`
  );
});

test('holders and supply fetchers skip invalid asset identifiers', async () => {
  await expect(fetchHolders('https://api.hiro.so', '', 10)).resolves.toBeUndefined();
  await expect(fetchFtSupply('https://api.hiro.so', '')).resolves.toBeUndefined();
  expect(fetchMock).not.toHaveBeenCalled();
  expect(fetchJsonMock).not.toHaveBeenCalled();
});

test('fetchTx reads the v3 transaction, requesting the given heavy fields', async () => {
  const tx = { tx_id: '0x01' };
  fetchMock.mockResolvedValue(new Response(JSON.stringify(tx)));

  await expect(
    fetchTx('https://api.hiro.so', '0x01', {
      include: ['post_conditions', 'result'],
      redirect: 'error',
    })
  ).resolves.toEqual(tx);
  expect(fetchMock.mock.calls[0][0]).toBe(
    'https://api.hiro.so/extended/v3/transactions/0x01?include=post_conditions,result'
  );
  expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: 'error' });
  expect(fetchMock.mock.calls[0][1]).not.toHaveProperty('include');
});

test('fetchTx omits the include parameter when no heavy fields are requested', async () => {
  fetchMock.mockResolvedValue(new Response('{}'));

  await fetchTx('https://api.hiro.so', '0x01');
  expect(fetchMock.mock.calls[0][0]).toBe('https://api.hiro.so/extended/v3/transactions/0x01');
});
