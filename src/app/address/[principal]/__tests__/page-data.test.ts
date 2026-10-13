/** @jest-environment node */
import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import { fetchAddressLatestNonce } from '../page-data';

jest.mock('@/api/stacksAPIFetch', () => ({
  stacksAPIFetch: jest.fn(),
  stacksAPIFetchJson: jest.fn(),
}));

const fetchMock = stacksAPIFetch as jest.MockedFunction<typeof stacksAPIFetch>;

test('fetchAddressLatestNonce reads the v3 principal nonces endpoint', async () => {
  const nonces = {
    next_nonce: 8,
    last_confirmed_nonce: 5,
    mempool: { last_nonce: 7, pending_nonces: [7], missing_nonces: [6] },
  };
  fetchMock.mockResolvedValue(new Response(JSON.stringify(nonces)));

  const result = await fetchAddressLatestNonce(
    'https://api.hiro.so',
    'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
  );

  expect(fetchMock.mock.calls[0][0]).toBe(
    'https://api.hiro.so/extended/v3/principals/SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7/nonces'
  );
  expect(result).toEqual(nonces);
});
