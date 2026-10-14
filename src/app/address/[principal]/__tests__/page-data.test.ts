/** @jest-environment node */
import { stacksAPIFetchJson } from '@/api/stacksAPIFetch';

import { fetchAddressLatestNonce, getAddressLatestNonceTag } from '../page-data';

jest.mock('@/api/stacksAPIFetch', () => ({
  stacksAPIFetch: jest.fn(),
  stacksAPIFetchJson: jest.fn(),
}));

const fetchJsonMock = stacksAPIFetchJson as jest.MockedFunction<typeof stacksAPIFetchJson>;

const ADDRESS = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

beforeEach(() => jest.clearAllMocks());

test('fetchAddressLatestNonce reads the v3 principal nonces endpoint', async () => {
  const nonces = {
    next_nonce: 8,
    last_confirmed_nonce: 5,
    mempool: { last_nonce: 7, pending_nonces: [7], missing_nonces: [6] },
  };
  fetchJsonMock.mockResolvedValue(nonces);

  const result = await fetchAddressLatestNonce('https://api.hiro.so', ADDRESS);

  const [url, options] = fetchJsonMock.mock.calls[0];
  expect(url).toBe(`https://api.hiro.so/extended/v3/principals/${ADDRESS}/nonces`);
  expect(options?.next).toEqual({ revalidate: 3, tags: [getAddressLatestNonceTag(ADDRESS)] });
  expect(result).toEqual(nonces);
});

test('fetchAddressLatestNonce skips contract principals', async () => {
  await expect(
    fetchAddressLatestNonce('https://api.hiro.so', `${ADDRESS}.my-contract`)
  ).resolves.toBeUndefined();
  expect(fetchJsonMock).not.toHaveBeenCalled();
});
