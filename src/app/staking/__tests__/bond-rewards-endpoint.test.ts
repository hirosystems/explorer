/** @jest-environment node */
import { GET } from '@/app/api/staking/bond-rewards/route';

import { deserializeBondRewards } from '../bond-reward-history';
import * as data from '../data';

jest.mock('../data', () => ({
  ...jest.requireActual('../data'),
  fetchPoxInfo: jest.fn(),
  fetchBondRewards: jest.fn(),
}));
jest.mock('@/common/utils/error-utils', () => ({
  ...jest.requireActual('@/common/utils/error-utils'),
  logError: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(data.fetchPoxInfo).mockResolvedValue({ contract_id: 'ST123.pox-5' } as never);
  jest.mocked(data.fetchBondRewards).mockResolvedValue({
    byBondIndex: { 2: BigInt('9007199254740993') },
    settlementsByBond: {
      2: [
        { calculationHeight: 100, timestampMs: 100000, rewardedSats: BigInt('9007199254740993') },
      ],
    },
    lastCalculationHeightByCycle: {},
  });
});

test('only loads the requested bonds and preserves exact amounts through JSON', async () => {
  const request = new Request('http://localhost/api/staking/bond-rewards?chain=testnet&bond=2');
  const response = await GET(request);
  expect(response.status).toBe(200);
  expect(data.fetchBondRewards).toHaveBeenCalledWith(
    [2],
    'testnet',
    expect.any(String),
    'ST123.pox-5',
    expect.any(Number),
    request.signal
  );
  const result = deserializeBondRewards(await response.json());
  expect(result.byBondIndex[2]).toBe(BigInt('9007199254740993'));
  expect(result.settlementsByBond[2][0].rewardedSats).toBe(BigInt('9007199254740993'));
  expect(result.settlementsByBond[2][0].principalSats).toBeUndefined();
});

test.each([
  '',
  'bond=0',
  'bond=-1',
  'bond=1.5',
  'bond=1e2',
  'bond=9007199254740992',
  'chain=devnet&bond=1',
  'api=https%3A%2F%2Funtrusted.example&bond=1',
  Array.from({ length: 11 }, (_, i) => `bond=${i + 1}`).join('&'),
])('rejects invalid or unbounded requests before fetching: %s', async query => {
  const response = await GET(new Request(`http://localhost/api/staking/bond-rewards?${query}`));
  expect(response.status).toBe(400);
  expect(data.fetchBondRewards).not.toHaveBeenCalled();
  expect(data.fetchPoxInfo).not.toHaveBeenCalled();
});

test('failed history is unavailable rather than a successful zero reward', async () => {
  jest.mocked(data.fetchBondRewards).mockRejectedValueOnce(new Error('request cap'));
  const response = await GET(new Request('http://localhost/api/staking/bond-rewards?bond=2'));
  expect(response.status).toBe(503);
});

test('a canceled page request does not start history loading', async () => {
  const controller = new AbortController();
  controller.abort();
  const response = await GET(
    new Request('http://localhost/api/staking/bond-rewards?bond=2', { signal: controller.signal })
  );
  expect(response.status).toBe(499);
  expect(data.fetchBondRewards).not.toHaveBeenCalled();
});
