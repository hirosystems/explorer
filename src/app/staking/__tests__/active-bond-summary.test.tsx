import { formatDateShort } from '@/common/utils/date-utils';
import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import { screen, within } from '@testing-library/react';

import { StakingStats } from '../StakingStats';
import { getActiveBondSummary } from '../active-bond-summary';
import type { Bond } from '../data';
import fixture from './fixtures/bond.json';

const first: Bond = {
  ...fixture,
  index: 1,
  parameters: { ...fixture.parameters, target_rate_bps: 200 },
  balances: { ...fixture.balances, locked: { btc: '100000000', stx: '2000000' } },
};
const second: Bond = {
  ...fixture,
  index: 2,
  parameters: { ...fixture.parameters, target_rate_bps: 400 },
  balances: { ...fixture.balances, locked: { btc: '900000000', stx: '8000000' } },
};
const distribution = (calculationHeight: number, rewardedSats: bigint | undefined) => ({
  calculationHeight,
  timestampMs: calculationHeight * 1000,
  rewardedSats,
});
const rewards = {
  1: [distribution(100, BigInt(90000)), distribution(200, BigInt(10000))],
  2: [distribution(200, BigInt(20000))],
};

test('averages active targets equally and sums only active balances and credited rewards', () => {
  expect(
    getActiveBondSummary(
      [
        first,
        second,
        { ...first, index: 3, status: 'upcoming' },
        { ...first, index: 4, status: 'unlocked' },
        { ...first, index: 5, status: 'closed' },
        { ...first, index: 6, status: 'projected' },
      ],
      rewards
    )
  ).toEqual({
    count: 2,
    averageTargetRateBps: 300,
    bondedSats: BigInt(1000000000),
    pairedMicroStx: BigInt(10000000),
    lastDistributionSats: BigInt(30000),
    lastDistributionTimestampMs: 200000,
  });
});

test('does not display a partial total when an active bond is missing one input', () => {
  const incomplete: Bond = {
    ...second,
    balances: { ...second.balances, locked: { btc: '', stx: 'invalid' } },
    parameters: { ...second.parameters, target_rate_bps: NaN },
  };
  expect(getActiveBondSummary([first, incomplete], { 1: rewards[1] })).toEqual({
    count: 2,
    averageTargetRateBps: undefined,
    bondedSats: undefined,
    pairedMicroStx: undefined,
    lastDistributionSats: undefined,
    lastDistributionTimestampMs: undefined,
  });
});

test('a missing reward history does not hide known balances and targets', () => {
  expect(getActiveBondSummary([first, second])).toMatchObject({
    count: 2,
    averageTargetRateBps: 300,
    bondedSats: BigInt(1000000000),
    pairedMicroStx: BigInt(10000000),
    lastDistributionSats: undefined,
    lastDistributionTimestampMs: undefined,
  });
});

test('preserves exact base-unit totals beyond the safe integer range', () => {
  const huge = {
    ...first,
    balances: {
      ...first.balances,
      locked: {
        btc: '9007199254740993',
        stx: '9007199254740993',
      },
    },
  };
  const summary = getActiveBondSummary([huge, second], {
    1: [distribution(200, BigInt('9007199254740993'))],
    2: [distribution(200, BigInt(1))],
  });
  expect(summary.bondedSats).toBe(BigInt('9007200154740993'));
  expect(summary.pairedMicroStx).toBe(BigInt('9007199262740993'));
  expect(summary.lastDistributionSats).toBe(BigInt('9007199254740994'));
});

test('zero active bonds have zero totals and no average yield', () => {
  expect(getActiveBondSummary([{ ...first, status: 'upcoming' }])).toEqual({
    count: 0,
    averageTargetRateBps: undefined,
    bondedSats: BigInt(0),
    pairedMicroStx: BigInt(0),
    lastDistributionSats: BigInt(0),
    lastDistributionTimestampMs: null,
  });
});

test('shows aggregate figures and omits the previous single-bond pairing and schedule captions', () => {
  renderWithChakraProviders(<StakingStats bonds={[first, second]} settlementsByBond={rewards} />);
  expect(screen.getByText('3.00%')).toBeInTheDocument();
  expect(screen.getByText('Simple average · across 2 active bonds')).toBeInTheDocument();
  expect(within(screen.getByLabelText('BTC bonded')).getByText('10')).toBeInTheDocument();
  expect(
    within(screen.getByLabelText('Latest reward distribution')).getByText('0.0003')
  ).toBeInTheDocument();
  expect(within(screen.getByLabelText('STX paired')).getByText('10')).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`${formatDateShort(200000)} · Across 2 active bonds`))
  ).toBeInTheDocument();
  expect(screen.queryByText('STX pairing')).not.toBeInTheDocument();
  expect(screen.queryByText(/Next scheduled/)).not.toBeInTheDocument();
  expect(screen.queryByText(/unlocks/)).not.toBeInTheDocument();
});

test('an unavailable bond list never displays zero totals', () => {
  renderWithChakraProviders(<StakingStats />);
  expect(screen.getAllByText('N/A')).toHaveLength(4);
  expect(screen.getByText('Active bond data unavailable')).toBeInTheDocument();
});

test('uses a shared latest distribution, not each bond’s most recent payout', () => {
  expect(
    getActiveBondSummary([first, second], {
      1: [distribution(100, BigInt(90000))],
      2: [distribution(200, BigInt(20000))],
    }).lastDistributionSats
  ).toBe(BigInt(20000));
});

test('ignores newer distributions belonging to inactive bonds', () => {
  expect(
    getActiveBondSummary([first, { ...second, status: 'closed' }], {
      1: rewards[1],
      2: [distribution(300, BigInt(90000))],
    }).lastDistributionSats
  ).toBe(BigInt(10000));
});

test('a new active bond with no distributions contributes zero', () => {
  expect(getActiveBondSummary([first, second], { 1: rewards[1], 2: [] }).lastDistributionSats).toBe(
    BigInt(10000)
  );
  expect(getActiveBondSummary([first, second], { 1: [], 2: [] }).lastDistributionSats).toBe(
    BigInt(0)
  );
});

test.each([undefined, BigInt(-1)])(
  'does not hide an unknown or invalid latest payout: %s',
  amount => {
    expect(
      getActiveBondSummary([first, second], {
        1: rewards[1],
        2: [distribution(200, amount)],
      }).lastDistributionSats
    ).toBeUndefined();
  }
);

test('counts matching duplicate calculation records once, but rejects conflicting payouts', () => {
  expect(
    getActiveBondSummary([first], { 1: [...rewards[1], ...rewards[1]] }).lastDistributionSats
  ).toBe(BigInt(10000));
  expect(
    getActiveBondSummary([first], {
      1: [...rewards[1], distribution(200, BigInt(20000))],
    }).lastDistributionSats
  ).toBeUndefined();
});

test('uses the recorded date from the same distribution as the headline amount', () => {
  const timestampMs = Date.parse('2026-10-08T01:30:00Z');
  const settlements = {
    1: [
      { ...distribution(100, BigInt(90000)), timestampMs: timestampMs - 604800000 },
      { ...distribution(200, BigInt(10000)), timestampMs },
    ],
    2: [],
  };
  expect(getActiveBondSummary([first, second], settlements).lastDistributionTimestampMs).toBe(
    timestampMs
  );
  renderWithChakraProviders(
    <StakingStats bonds={[first, second]} settlementsByBond={settlements} />
  );
  expect(
    within(screen.getByLabelText('Latest reward distribution')).getByText(
      new RegExp(`${formatDateShort(timestampMs)} · Across 2 active bonds`)
    )
  ).toBeInTheDocument();
});
