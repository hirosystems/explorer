/** @jest-environment node */
import { stacksAPIFetchJson } from '@/api/stacksAPIFetch';

import { fetchStxHolders, fetchStxSupply } from '../data';

jest.mock('@/api/stacksAPIFetch', () => ({ stacksAPIFetchJson: jest.fn() }));

const fetchJsonMock = stacksAPIFetchJson as jest.MockedFunction<typeof stacksAPIFetchJson>;

test('fetchStxSupply reads the v3 STX supply endpoint', async () => {
  const supply = { total: '1874370687477029', projected_total_2050: '2318000000000000' };
  fetchJsonMock.mockResolvedValue(supply);

  await expect(fetchStxSupply('https://api.hiro.so')).resolves.toEqual(supply);
  expect(fetchJsonMock.mock.calls[0][0]).toBe('https://api.hiro.so/extended/v3/tokens/stx/supply');
});

test('fetchStxHolders reads the v3 STX holders endpoint', async () => {
  const page = { limit: 10, total: 0, cursor: {}, results: [] };
  fetchJsonMock.mockResolvedValue(page);

  await expect(fetchStxHolders('https://api.hiro.so', 10)).resolves.toEqual(page);
  expect(fetchJsonMock.mock.calls.at(-1)?.[0]).toBe(
    'https://api.hiro.so/extended/v3/tokens/stx/holders?limit=10'
  );
});
