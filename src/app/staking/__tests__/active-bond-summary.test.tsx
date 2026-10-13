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
const latestTimestampMs = Date.parse('2026-10-08T01:30:00Z');
const distribution = (calculationHeight: number, rewardedSats: bigint | undefined) => ({
  calculationHeight,
  timestampMs: latestTimestampMs + (calculationHeight - 200) * 60 * 60 * 1000,
  rewardedSats,
});
const rewards = {
  1: [distribution(100, BigInt(90000)), distribution(200, BigInt(10000))],
  2: [distribution(200, BigInt(20000))],
};

test('averages cycle-selected targets and ignores rewards outside that membership', () => {
  expect(
    getActiveBondSummary([first, { ...second, status: 'upcoming' }], {
      ...rewards,
      5: [distribution(300, BigInt(90000))],
    })
  ).toEqual({
    count: 2,
    averageTargetRateBps: 300,
    bondedSats: BigInt(1000000000),
    pairedMicroStx: BigInt(10000000),
    lastDistributionSats: BigInt(30000),
    lastDistributionTimestampMs: latestTimestampMs,
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
  expect(getActiveBondSummary([])).toEqual({
    count: 0,
    averageTargetRateBps: undefined,
    bondedSats: BigInt(0),
    pairedMicroStx: BigInt(0),
    lastDistributionSats: BigInt(0),
    lastDistributionTimestampMs: null,
  });
});

test('renders the active summary and recorded distribution date', () => {
  renderWithChakraProviders(
    <StakingStats activeBonds={[first, second]} settlementsByBond={rewards} />
  );
  expect(screen.getByText('3.00%')).toBeInTheDocument();
  expect(screen.getByText('Simple average · across 2 active bonds')).toBeInTheDocument();
  expect(within(screen.getByLabelText('BTC bonded')).getByText('10')).toBeInTheDocument();
  expect(
    within(screen.getByLabelText('Latest reward distribution')).getByText('0.0003')
  ).toBeInTheDocument();
  expect(within(screen.getByLabelText('STX paired')).getByText('10')).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`${formatDateShort(latestTimestampMs)} · Across 2 active bonds`))
  ).toBeInTheDocument();
});

test('uses a shared latest distribution, not each bond’s most recent payout', () => {
  expect(
    getActiveBondSummary([first, second], {
      1: [distribution(100, BigInt(90000))],
      2: [distribution(200, BigInt(20000))],
    }).lastDistributionSats
  ).toBe(BigInt(20000));
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
