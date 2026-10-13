/** @jest-environment node */
import { stacksAPIFetchJson } from '@/api/stacksAPIFetch';

import { fetchStxSupply } from '../data';

jest.mock('@/api/stacksAPIFetch', () => ({ stacksAPIFetchJson: jest.fn() }));

const fetchJsonMock = stacksAPIFetchJson as jest.MockedFunction<typeof stacksAPIFetchJson>;

test('fetchStxSupply reads the v3 STX supply endpoint', async () => {
  const supply = { total: '1874370687477029', projected_total_2050: '2318000000000000' };
  fetchJsonMock.mockResolvedValue(supply);

  await expect(fetchStxSupply('https://api.hiro.so')).resolves.toEqual(supply);
  expect(fetchJsonMock.mock.calls[0][0]).toBe('https://api.hiro.so/extended/v3/tokens/stx/supply');
});
