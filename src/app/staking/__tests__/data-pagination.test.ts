import { stacksAPIFetch } from '@/api/stacksAPIFetch';

import { fetchBondRegistrations, fetchBondRewards } from '../data';

jest.mock('@/api/stacksAPIFetch');
const fetchMock = stacksAPIFetch as jest.MockedFunction<typeof stacksAPIFetch>;

function respond(body: unknown) {
  return { ok: true, status: 200, json: async () => body } as Response;
}

beforeEach(() => fetchMock.mockReset());

test('includes every registration using the returned opaque cursor', async () => {
  fetchMock
    .mockResolvedValueOnce(
      respond({
        results: [{ staker: 'first', balances: { btc: '100', stx: '200' } }],
        cursor: { next: '123:0:4' },
      })
    )
    .mockResolvedValueOnce(
      respond({
        results: [{ staker: 'second', balances: { btc: '300', stx: '400' } }],
        cursor: { next: null },
      })
    );

  const registrations = await fetchBondRegistrations(1, 'mainnet');

  expect(registrations.map(row => row.staker)).toEqual(['first', 'second']);
  expect(new URL(fetchMock.mock.calls[1][0]).searchParams.get('cursor')).toBe('123:0:4');
});

test('does not return a partial enrollment total when a later page fails', async () => {
  fetchMock
    .mockResolvedValueOnce(
      respond({
        results: [{ staker: 'first', balances: { btc: '100', stx: '200' } }],
        cursor: { next: '123:0:4' },
      })
    )
    .mockResolvedValueOnce({ ok: false, status: 503 } as Response);

  await expect(fetchBondRegistrations(1, 'mainnet')).rejects.toThrow('503');
});

test('includes distributions beyond the first transaction event page', async () => {
  const log = (repr: string) => ({ contract_log: { value: { repr } } });
  fetchMock.mockImplementation(async url => {
    if (url.includes('function_name=')) {
      return respond({
        results: [{ tx_id: '0xabc', tx_status: 'success', burn_block_time: 1700000000 }],
      });
    }
    const offset = Number(new URL(url).searchParams.get('event_offset'));
    return respond({
      event_count: 102,
      events:
        offset === 0
          ? Array.from({ length: 100 }, () => ({ asset: {} }))
          : [
              log(
                '(tuple (topic "calculate-rewards") (total-bond-rewards u123) (stx-cycle u143) (calculation-height u967399))'
              ),
              log(
                '(tuple (topic "bond-distribution") (bond-index u1) (bond-rewards u123) (bond-staked-sats u10000))'
              ),
            ],
    });
  });

  await expect(fetchBondRewards('SP000000000000000000002Q6VF78.pox-5', 'mainnet')).resolves.toEqual(
    {
      byBondIndex: { 1: BigInt(123) },
      byCycle: { 143: BigInt(123) },
      lastCalculationHeightByCycle: { 143: 967399 },
      settlementsByBond: {
        1: [
          {
            calculationHeight: 967399,
            timestampMs: 1700000000000,
            principalSats: BigInt(10000),
            rewardedSats: BigInt(123),
          },
        ],
      },
    }
  );
});

test('rejects a truncated event response instead of reporting an incomplete reward total', async () => {
  fetchMock
    .mockResolvedValueOnce(
      respond({ results: [{ tx_id: '0xabc', tx_status: 'success', burn_block_time: 1700000000 }] })
    )
    .mockResolvedValueOnce(respond({ event_count: 10, events: [] }));

  await expect(fetchBondRewards('SP000000000000000000002Q6VF78.pox-5', 'mainnet')).rejects.toThrow(
    'Incomplete events'
  );
});

test('complete empty history is distinguishable from unavailable settlement history', async () => {
  fetchMock.mockResolvedValue(respond({ results: [] }));
  await expect(fetchBondRewards('SP000000000000000000002Q6VF78.pox-5', 'mainnet')).resolves.toEqual(
    {
      byBondIndex: {},
      byCycle: {},
      lastCalculationHeightByCycle: {},
      settlementsByBond: {},
    }
  );
});

test('zero-credit settlement is recorded with the transaction timestamp', async () => {
  fetchMock.mockImplementation(async url => {
    if (url.includes('function_name='))
      return respond({
        results: [{ tx_id: '0xzero', tx_status: 'success', block_time: 200, burn_block_time: 100 }],
      });
    return respond({
      event_count: 2,
      events: [
        {
          contract_log: {
            value: {
              repr: '(tuple (topic "calculate-rewards") (total-bond-rewards u0) (stx-cycle u143) (calculation-height u967399))',
            },
          },
        },
        {
          contract_log: {
            value: {
              repr: '(tuple (topic "bond-distribution") (bond-index u1) (bond-rewards u0))',
            },
          },
        },
      ],
    });
  });
  const rewards = await fetchBondRewards('SP000000000000000000002Q6VF78.pox-5', 'mainnet');
  expect(rewards?.byBondIndex[1]).toBe(BigInt(0));
  expect(rewards?.settlementsByBond[1]).toEqual([
    {
      calculationHeight: 967399,
      timestampMs: 200000,
      principalSats: undefined,
      rewardedSats: BigInt(0),
    },
  ]);
});
