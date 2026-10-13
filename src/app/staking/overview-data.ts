import { handleSettledResult } from '@/app/address/[principal]/page-data';

import type { StackingPageData, StakingPageData } from './PageClient';
import { mergeBondDetail } from './bond-schedule';
import { PREVIOUS_CYCLES_LIMIT, SCHEDULED_BONDS_AHEAD } from './consts';
import {
  type ProjectedBond,
  createRewardHistoryDeadline,
  fetchBondRegistrations,
  fetchBondRewards,
  fetchBondSchedule,
  fetchBondsPage,
  fetchBurnBlockTimes,
  fetchCurrentCycleBonds,
  fetchCycleCalculationHeights,
  fetchCycleRewards,
  fetchPoxCycles,
  fetchPoxInfo,
  handleRewardHistoryResult,
} from './data';
import { fetchFeaturedBond } from './page-data';
import { fetchDailyPrices } from './prices';
import {
  burnHeightToApproximateTimestamp,
  getBondSchedule,
  getFeaturedBondIndex,
  getTimelineBondWindow,
} from './projections';
import { fetchCurrentCycleEstimate } from './reward-estimate';

// The summary starts independently of the bounded recent-bond page.
export function loadStakingOverview(chain: string, api?: string) {
  const pox = Promise.allSettled([fetchPoxInfo(chain, api)]).then(([result]) =>
    handleSettledResult(result, 'Staking page: fetch pox info')
  );
  const current = Promise.all([
    pox,
    Promise.allSettled([fetchCurrentCycleBonds(chain, api)]).then(([result]) =>
      handleSettledResult(result, 'Staking page: current-cycle bonds')
    ),
  ]).then(([poxInfo, activeBonds]) => ({
    poxInfo,
    activeBonds,
    rewardHistoryDeadline: createRewardHistoryDeadline(),
  }));
  const base = loadOverviewBase(chain, api, pox);
  const featuredRewards = current.then(async data => {
    const index = getFeaturedBondIndex(data.activeBonds ?? []);
    const [result] = await Promise.allSettled([
      index === undefined
        ? undefined
        : fetchBondRewards(
            [index],
            chain,
            api,
            data.poxInfo?.contract_id,
            data.rewardHistoryDeadline
          ),
    ]);
    return handleRewardHistoryResult(result, 'Staking page: featured bond rewards');
  });
  const summary = current.then(async data => {
    const featuredIndex = getFeaturedBondIndex(data.activeBonds ?? []);
    const indexes =
      data.activeBonds?.filter(bond => bond.index !== featuredIndex).map(bond => bond.index) ?? [];
    const [result] = await Promise.allSettled([
      indexes.length
        ? fetchBondRewards(
            indexes,
            chain,
            api,
            data.poxInfo?.contract_id,
            data.rewardHistoryDeadline
          )
        : undefined,
    ]);
    return {
      activeBonds: data.activeBonds,
      rewarded: mergeBondRewards([
        handleRewardHistoryResult(result, 'Staking page: active bond rewards'),
        await featuredRewards,
      ]),
    };
  });
  return {
    summary,
    bonds: loadBondsOverview(
      base,
      current.then(data => data.activeBonds),
      summary,
      chain,
      api
    ),
    stacking: loadStackingOverview(base, featuredRewards, chain, api),
  };
}

async function loadOverviewBase(
  chain: string,
  api: string | undefined,
  pox: Promise<Awaited<ReturnType<typeof fetchPoxInfo>> | undefined>
) {
  const nowMs = Date.now();
  const [pageResult, poxInfo] = await Promise.all([
    Promise.allSettled([fetchBondsPage(chain, api)]).then(([result]) => result),
    pox,
  ]);
  const page = handleSettledResult(pageResult, 'Staking page: fetch recent bonds');
  return {
    rewardHistoryNetwork: { chain, api },
    bonds: page?.bonds ?? [],
    bondsUnavailable: page === undefined,
    hasMoreBonds: page?.nextCursor != null,
    poxInfo,
    nowMs,
    currentBurnHeight: poxInfo?.current_burnchain_block_height ?? 0,
    rewardCycleLength: poxInfo?.reward_cycle_length ?? 0,
    prepareCycleLength: poxInfo?.prepare_phase_block_length ?? 0,
    firstBurnchainBlockHeight: poxInfo?.first_burnchain_block_height ?? 0,
    rewardHistoryDeadline: createRewardHistoryDeadline(),
  };
}

function mergeBondRewards(results: (Awaited<ReturnType<typeof fetchBondRewards>> | undefined)[]) {
  const available = results.filter(
    (value): value is NonNullable<typeof value> => value !== undefined
  );
  const rewarded: StakingPageData['rewarded'] = available.length
    ? { byBondIndex: {}, settlementsByBond: {}, lastCalculationHeightByCycle: {} }
    : undefined;
  for (const result of available) {
    Object.assign(rewarded!.byBondIndex, result.byBondIndex);
    Object.assign(rewarded!.settlementsByBond, result.settlementsByBond);
    for (const [cycle, height] of Object.entries(result.lastCalculationHeightByCycle)) {
      rewarded!.lastCalculationHeightByCycle[Number(cycle)] = Math.max(
        height,
        rewarded!.lastCalculationHeightByCycle[Number(cycle)] ?? 0
      );
    }
  }
  return rewarded;
}

type OverviewBase = ReturnType<typeof loadOverviewBase>;
type FeaturedRewards = Promise<Awaited<ReturnType<typeof fetchBondRewards>> | undefined>;

async function loadBondsOverview(
  base: OverviewBase,
  currentBonds: Promise<Awaited<ReturnType<typeof fetchCurrentCycleBonds>> | undefined>,
  summary: Promise<{
    activeBonds: Awaited<ReturnType<typeof fetchCurrentCycleBonds>> | undefined;
    rewarded: StakingPageData['rewarded'];
  }>,
  chain: string,
  api?: string
): Promise<StakingPageData> {
  const [data, activeBonds] = await Promise.all([base, currentBonds]);
  const { bonds, poxInfo, currentBurnHeight, rewardCycleLength, prepareCycleLength } = data;
  const featuredIndex = getFeaturedBondIndex(bonds);
  const activeIndexes = activeBonds?.map(bond => bond.index) ?? [];
  const timelineBonds = getTimelineBondWindow(bonds, featuredIndex, currentBurnHeight).onChain;
  const historicalIndexes = timelineBonds
    .filter(bond => !activeIndexes.includes(bond.index))
    .map(bond => bond.index);
  const heights = timelineBonds.flatMap(bond =>
    Object.values(
      getBondSchedule(
        bond.schedule.activation.bitcoin_height,
        bond.schedule.unlock.bitcoin_height,
        rewardCycleLength,
        prepareCycleLength,
        bond.schedule
      )
    )
  );
  // Ask for immediate successors before local estimates can rule them out.
  const latestIndex = Math.max(0, ...bonds.map(bond => bond.index));
  const projectedIndices = latestIndex
    ? Array.from({ length: SCHEDULED_BONDS_AHEAD }, (_, offset) => latestIndex + offset + 1)
    : [];
  const projectionController = new AbortController();
  const projectionTimeout = setTimeout(() => projectionController.abort(), 5000);
  const projected = Promise.allSettled(
    projectedIndices.map(index => fetchBondSchedule(index, chain, api, projectionController.signal))
  )
    .finally(() => clearTimeout(projectionTimeout))
    .then(results =>
      // The per-index cache can report a declared successor before the list does.
      results.flatMap<ProjectedBond>(result =>
        result.status === 'fulfilled'
          ? [{ index: result.value.index, status: 'projected', schedule: result.value.schedule }]
          : []
      )
    );
  const [historicalResult, enrollmentsResult, detailResult, timesResult] = await Promise.allSettled(
    [
      historicalIndexes.length
        ? fetchBondRewards(
            historicalIndexes,
            chain,
            api,
            poxInfo?.contract_id,
            data.rewardHistoryDeadline
          )
        : undefined,
      featuredIndex !== undefined ? fetchBondRegistrations(featuredIndex, chain, api) : undefined,
      featuredIndex !== undefined ? fetchFeaturedBond(featuredIndex, chain, api) : undefined,
      fetchBurnBlockTimes(heights, currentBurnHeight, chain, api),
    ]
  );
  const rewarded = mergeBondRewards([
    handleRewardHistoryResult(historicalResult, 'Staking page: timeline bond rewards'),
    (await summary).rewarded,
  ]);
  const detail = handleSettledResult(detailResult, 'Staking page: bond setup');
  const enrollments = handleSettledResult(enrollmentsResult, 'Staking page: enrollments');
  return {
    ...data,
    bonds: bonds.map(bond =>
      detail && bond.index === detail.index ? mergeBondDetail(bond, detail) : bond
    ),
    projectedBonds: await projected,
    rewarded,
    enrollments: enrollments?.map(enrollment => ({ btc: enrollment.balances.btc })),
    burnBlockTimes: handleSettledResult(timesResult, 'Staking page: bond dates') ?? {},
  };
}

async function loadStackingOverview(
  base: OverviewBase,
  featuredRewards: FeaturedRewards,
  chain: string,
  api?: string
): Promise<StackingPageData> {
  const [data, cyclesResult] = await Promise.all([
    base,
    Promise.allSettled([fetchPoxCycles(chain, api)]).then(([result]) => result),
  ]);
  const { poxInfo, currentBurnHeight, rewardCycleLength, firstBurnchainBlockHeight, nowMs } = data;
  const poxCycles = handleSettledResult(cyclesResult, 'Staking page: fetch pox cycles');
  const cycles = (poxCycles ?? [])
    .filter(cycle => cycle.cycle_number <= (poxInfo?.current_cycle?.id ?? -1))
    .sort((a, b) => b.cycle_number - a.cycle_number)
    .slice(0, PREVIOUS_CYCLES_LIMIT + 1);
  const pox5FirstCycleId = poxInfo?.contract_versions?.find(
    version => version.contract_id.split('.')[1] === 'pox-5'
  )?.first_reward_cycle_id;
  const rewardCycles = Array.from(
    new Set([
      ...cycles.map(cycle => cycle.cycle_number),
      ...(poxInfo?.current_cycle?.id === undefined ? [] : [poxInfo.current_cycle.id]),
    ])
  ).filter(cycle => pox5FirstCycleId !== undefined && cycle >= pox5FirstCycleId);
  const settlement = async () => {
    const rewarded = await featuredRewards;
    const known = rewarded?.lastCalculationHeightByCycle;
    // The featured scan already reports timeout. Do not start or log it a second time.
    if (!poxInfo?.contract_id || !rewardCycleLength || Date.now() >= data.rewardHistoryDeadline)
      return known;
    const [result] = await Promise.allSettled([
      fetchCycleCalculationHeights(
        Object.fromEntries(
          rewardCycles
            .filter(cycle => cycle < poxInfo.current_cycle.id)
            .map(cycle => [cycle, firstBurnchainBlockHeight + (cycle + 1) * rewardCycleLength - 1])
        ),
        poxInfo.contract_id,
        chain,
        api,
        known,
        data.rewardHistoryDeadline
      ),
    ]);
    return handleRewardHistoryResult(result, 'Staking page: cycle settlement') ?? known;
  };
  const [rewardsResult, timesResult, pricesResult, estimateResult, heightsResult] =
    await Promise.allSettled([
      poxInfo?.contract_id && rewardCycles.length
        ? fetchCycleRewards(rewardCycles, chain, api, poxInfo.contract_id)
        : undefined,
      fetchBurnBlockTimes(
        cycles.flatMap(cycle => [
          firstBurnchainBlockHeight + cycle.cycle_number * rewardCycleLength,
          firstBurnchainBlockHeight + (cycle.cycle_number + 1) * rewardCycleLength - 1,
        ]),
        currentBurnHeight,
        chain,
        api
      ),
      cycles.length && rewardCycleLength
        ? fetchDailyPrices(
            burnHeightToApproximateTimestamp(
              firstBurnchainBlockHeight +
                Math.min(...cycles.map(cycle => cycle.cycle_number)) * rewardCycleLength,
              currentBurnHeight,
              nowMs
            ),
            nowMs
          )
        : undefined,
      poxInfo?.contract_id.split('.')[1] === 'pox-5' && rewardCycles.length
        ? fetchCurrentCycleEstimate(poxInfo, data.bonds, chain, api)
        : undefined,
      settlement(),
    ]);
  return {
    poxInfo,
    currentBurnHeight,
    firstBurnchainBlockHeight,
    nowMs,
    cycles,
    pox5FirstCycleId,
    cycleRewards: handleSettledResult(rewardsResult, 'Staking page: cycle rewards') ?? {},
    burnBlockTimes: handleSettledResult(timesResult, 'Staking page: cycle dates') ?? {},
    prices: handleSettledResult(pricesResult, 'Staking page: daily prices'),
    currentCycleEstimate: handleSettledResult(estimateResult, 'Staking page: reward estimate'),
    lastCalculationHeightByCycle: handleRewardHistoryResult(
      heightsResult,
      'Staking page: cycle settlement'
    ),
  };
}
