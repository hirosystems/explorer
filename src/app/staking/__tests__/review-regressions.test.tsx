import { formatDateShort } from '@/common/utils/date-utils';
import { renderWithChakraProviders } from '@/common/utils/test-utils/render-utils';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnnotatedValue } from '../AnnotatedValue';
import { BondTooltip } from '../BondTooltip';
import { BondsTable } from '../BondsTable';
import { CurrentBond } from '../CurrentBond';
import { StackingPageClient, StakingPageClient, StakingPageData } from '../PageClient';
import { PeriodsOverview } from '../PeriodsOverview';
import { ActiveBondsSummary, StakingStats } from '../StakingStats';
import { getBarPosition, getBondSchedule, getTimelineBounds } from '../projections';
import bondFixture from './fixtures/bond.json';

const originalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

test('API dates agree across the lifecycle, table, tooltip, and timeline positions', async () => {
  const activationMs = Date.parse('2026-10-09T00:17:52Z');
  const unlockMs = Date.parse('2027-04-01T13:42:14Z');
  const nowMs = Date.parse('2026-10-13T12:00:00Z');
  const bond = {
    ...bondFixture,
    schedule: {
      enrollment_cutoff: { bitcoin_height: 970440, pox_cycle: 144, time: 1791439352 },
      activation: { bitcoin_height: 970550, pox_cycle: 145, time: activationMs / 1000 },
      unlock: { bitcoin_height: 995750, pox_cycle: 157, projected_time: unlockMs / 1000 },
    },
  };
  const shared = {
    currentBurnHeight: 971267,
    nowMs,
    rewardCycleLength: 2100,
    prepareCycleLength: 100,
    burnBlockTimes: {},
  };
  const { rerender } = renderWithChakraProviders(<CurrentBond featuredBond={bond} {...shared} />);
  expect(screen.getAllByText(formatDateShort(activationMs)).length).toBeGreaterThan(0);
  expect(screen.getByText(`~${formatDateShort(unlockMs)}`)).toBeInTheDocument();
  expect(screen.getByText('#970,440')).toBeInTheDocument();

  rerender(<BondsTable bonds={[bond]} {...shared} />);
  expect(
    screen.getByText(`${formatDateShort(activationMs)} → ~${formatDateShort(unlockMs)}`)
  ).toBeInTheDocument();

  rerender(
    <BondTooltip
      bond={{
        label: 'Bond 3',
        state: 'active',
        schedule: getBondSchedule(970550, 995750, 2100, 100, bond.schedule),
        apiSchedule: bond.schedule,
      }}
      elapsedDistributions={0}
      {...shared}
    />
  );
  expect(
    screen.getByText(
      `${formatDateShort(activationMs)} → ~${formatDateShort(unlockMs)} (in 170 days)`
    )
  ).toBeInTheDocument();

  rerender(
    <PeriodsOverview
      bonds={[bond]}
      featuredIndex={bond.index}
      firstBurnchainBlockHeight={666050}
      {...shared}
    />
  );
  const bounds = getTimelineBounds([{ startMs: activationMs, endMs: unlockMs }], nowMs);
  const position = getBarPosition(activationMs, unlockMs, bounds.startMs, bounds.endMs);
  const bar = screen.getByRole('img', { name: /Bond 3, active/ });
  expect(bar).toHaveStyle({ left: `${position.leftPercent}%`, width: `${position.widthPercent}%` });
  await act(async () => {});
});

const overviewWithoutPox: StakingPageData = {
  bonds: [bondFixture],
  bondsUnavailable: false,
  currentBurnHeight: 0,
  nowMs: Date.UTC(2026, 8, 1),
  rewardCycleLength: 0,
  prepareCycleLength: 0,
  firstBurnchainBlockHeight: 0,
  burnBlockTimes: {},
  rewarded: {
    byBondIndex: { [bondFixture.index]: BigInt(100000000) },
    settlementsByBond: {},
    lastCalculationHeightByCycle: {},
  },
};

test('overview preserves bonds and known rewards when PoX is missing without inventing dates or rates', () => {
  renderWithChakraProviders(<StakingPageClient {...overviewWithoutPox} />);
  expect(screen.getByText(/Some staking data could not be loaded/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Bonds' })).toBeInTheDocument();
  expect(screen.getByText('Bond 3')).toBeInTheDocument();
  expect(screen.getByText('1 sBTC')).toBeInTheDocument();
  expect(screen.getByText('Unavailable → Unavailable')).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Current Bitcoin block height is unavailable.' })
  ).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Active bonds' })).not.toBeInTheDocument();
});

test('overview does not substitute a misleading empty table when both bonds and PoX fail', () => {
  renderWithChakraProviders(
    <StakingPageClient {...overviewWithoutPox} bonds={[]} bondsUnavailable />
  );
  expect(screen.getByText(/Some staking data could not be loaded/)).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.queryByText('No bonds yet')).not.toBeInTheDocument();
});

test('missing PoX does not duplicate the bond fallback in the stacking section', () => {
  renderWithChakraProviders(
    <StackingPageClient {...overviewWithoutPox} cycles={[]} cycleRewards={{}} />
  );
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test.each([
  { activeBonds: [bondFixture], expected: 'Simple average · across 1 active bond' },
  { activeBonds: undefined, expected: 'Active bond data unavailable' },
  { activeBonds: [], expected: 'No active bonds' },
])('the independent summary renders current-cycle availability: %j', props => {
  renderWithChakraProviders(<ActiveBondsSummary activeBonds={props.activeBonds} />);
  expect(screen.getAllByText(props.expected).length).toBeGreaterThan(0);
  if (props.activeBonds === undefined) {
    const summary = screen.getByLabelText('BTC bonded').parentElement!;
    expect(within(summary).getAllByText('N/A')).toHaveLength(4);
  }
});

test('value annotations have a named, keyboard-accessible help trigger', async () => {
  const user = userEvent.setup();
  const note = 'Complete reward allocation history is unavailable.';
  renderWithChakraProviders(<AnnotatedValue value="N/A" note={note} />);

  const trigger = screen.getByRole('button', { name: note });
  await user.tab();
  expect(trigger).toHaveFocus();
  expect(await screen.findByRole('tooltip')).toHaveTextContent(note);
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
});

test('bond pagination reaches every row, including the short final page, and resets on data changes', async () => {
  const user = userEvent.setup();
  const bonds = Array.from({ length: 5 }, (_, i) => ({ ...bondFixture, index: i + 1 }));
  const props = { bonds, currentBurnHeight: 9508, nowMs: Date.UTC(2026, 7, 25), pageSize: 2 };
  const { rerender } = renderWithChakraProviders(<BondsTable {...props} />);

  expect(screen.getByText('Bond 5')).toBeInTheDocument();
  expect(screen.getByText('Bond 4')).toBeInTheDocument();
  expect(screen.queryByText('Bond 3')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Go to next page' }));
  expect(await screen.findByText('Bond 3')).toBeInTheDocument();
  expect(screen.getByText('Bond 2')).toBeInTheDocument();
  expect(screen.queryByText('Bond 5')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Go to next page' }));
  expect(await screen.findByText('Genesis')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();

  await act(async () => rerender(<BondsTable {...props} bonds={bonds.slice(3)} />));
  expect(screen.getByText('Bond 5')).toBeInTheDocument();
  expect(screen.getByText('Bond 4')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Go to next page' })).not.toBeInTheDocument();
});

test('a server-paginated bond table displays the supplied page without slicing it again', async () => {
  const user = userEvent.setup();
  const onPageChange = jest.fn();
  renderWithChakraProviders(
    <BondsTable
      bonds={[
        { ...bondFixture, index: 3 },
        { ...bondFixture, index: 2 },
      ]}
      currentBurnHeight={9508}
      nowMs={Date.UTC(2026, 7, 25)}
      serverPagination={{ pageIndex: 1, pageSize: 2, totalRows: 5, onPageChange }}
    />
  );
  expect(screen.getByText('Bond 3')).toBeInTheDocument();
  expect(screen.getByText('Bond 2')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Go to next page' }));
  await waitFor(() => expect(onPageChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 2 }));
});

test('active-bond stats preserve missing balances rather than showing zero or crashing', () => {
  renderWithChakraProviders(
    <StakingStats
      activeBonds={[
        {
          ...bondFixture,
          balances: { ...bondFixture.balances, locked: { btc: '', stx: 'invalid' } },
        },
      ]}
    />
  );
  expect(screen.getAllByText('N/A')).toHaveLength(3);
  expect(screen.getByText('Bond balance unavailable')).toBeInTheDocument();
  expect(screen.getByText(/Paired balance unavailable/)).toBeInTheDocument();
});

test('an invalid enrollment prevents a misleading partial total', () => {
  renderWithChakraProviders(
    <CurrentBond
      featuredBond={bondFixture}
      enrollments={[{ btc: '100000000' }, { btc: 'invalid' }]}
      burnBlockTimes={{}}
      rewardCycleLength={900}
      prepareCycleLength={100}
      currentBurnHeight={9508}
      nowMs={Date.UTC(2026, 7, 25)}
    />
  );
  expect(screen.getByText('Unavailable')).toBeInTheDocument();
  expect(screen.getByText(/Enrollment data could not be loaded/)).toBeInTheDocument();
  expect(screen.queryByText('1 BTC')).not.toBeInTheDocument();
});

test('a finished bond shows its final day and identifies progress as a bond term', () => {
  renderWithChakraProviders(
    <CurrentBond
      featuredBond={bondFixture}
      burnBlockTimes={{}}
      rewardCycleLength={900}
      prepareCycleLength={100}
      currentBurnHeight={bondFixture.schedule.unlock.bitcoin_height + 144}
      nowMs={Date.UTC(2026, 7, 25)}
    />
  );
  expect(screen.getByText('Day 75 of 75')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Bond term progress' })).toHaveAttribute(
    'aria-valuenow',
    '100'
  );
});

test('unknown progress shows an unavailable label and an indeterminate progress bar', () => {
  renderWithChakraProviders(
    <CurrentBond
      featuredBond={bondFixture}
      burnBlockTimes={{}}
      rewardCycleLength={900}
      prepareCycleLength={100}
      currentBurnHeight={NaN}
      nowMs={Date.UTC(2026, 7, 25)}
    />
  );
  expect(screen.getByText('Progress unavailable')).toBeInTheDocument();
  expect(screen.getByText('Day unavailable')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Bond term progress' })).not.toHaveAttribute(
    'aria-valuenow'
  );
  expect(screen.queryByText(/NaN% elapsed/)).not.toBeInTheDocument();
});

test('a bond without verified setup metadata renders its schedule estimate', () => {
  renderWithChakraProviders(
    <CurrentBond
      featuredBond={bondFixture}
      burnBlockTimes={{}}
      rewardCycleLength={900}
      prepareCycleLength={100}
      currentBurnHeight={9508}
      nowMs={Date.UTC(2026, 7, 25)}
    />
  );
  expect(screen.getByText('Earliest setup window')).toBeInTheDocument();
  expect(screen.getByText('#7,200')).toBeInTheDocument();
  expect(screen.queryByText('Enrollment opened')).not.toBeInTheDocument();
});
