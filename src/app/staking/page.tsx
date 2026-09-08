import { NetworkModes } from '@/common/types/network';

import { StakingPageClient } from './PageClient';
import { ACTIVITY_FEED_LIMIT, PREVIOUS_CYCLES_LIMIT } from './consts';
import {
  fetchBond,
  fetchBondRegistrations,
  fetchBondRewards,
  fetchBondsPage,
  fetchBurnBlockTimes,
  fetchCycleRewards,
  fetchPoxCycles,
  fetchPoxInfo,
  fetchStakingActivity,
  parseActivityGroup,
} from './data';
import { load } from './load';
import { fetchDailyPrices } from './prices';
import {
  burnHeightToApproximateTimestamp,
  getBondSchedule,
  getFeaturedBondIndex,
} from './projections';
import { fetchCurrentCycleEstimate } from './reward-estimate';

interface StakingSearchParams {
  chain?: string;
  api?: string;
  activity?: string;
}

export default async function StakingPage(props: { searchParams: Promise<StakingSearchParams> }) {
  const { chain = NetworkModes.Mainnet, api, activity: activityGroup } = await props.searchParams;
  const selectedActivityGroup = parseActivityGroup(activityGroup);
  const nowMs = Date.now();
  const [bondsPage, poxInfo, poxCycles] = await Promise.all([
    load(fetchBondsPage(chain, api), 'Staking page: fetch bonds', chain),
    load(fetchPoxInfo(chain, api), 'Staking page: fetch pox info', chain),
    load(fetchPoxCycles(chain, api), 'Staking page: fetch pox cycles', chain),
  ]);
  const bonds = bondsPage?.bonds ?? [];
  const cycles = (poxCycles ?? [])
    .filter(cycle => cycle.cycle_number <= (poxInfo?.current_cycle.id ?? -1))
    .sort((a, b) => b.cycle_number - a.cycle_number)
    .slice(0, PREVIOUS_CYCLES_LIMIT + 1);
  const pox5FirstCycleId = poxInfo?.contract_versions?.find(
    version => version.contract_id.split('.')[1] === 'pox-5'
  )?.first_reward_cycle_id;
  const rewardCycleLength = poxInfo?.reward_cycle_length ?? 0;
  const prepareCycleLength = poxInfo?.prepare_phase_block_length ?? 0;
  const firstBurnchainBlockHeight = poxInfo?.first_burnchain_block_height ?? 0;
  const currentBurnHeight = poxInfo?.current_burnchain_block_height ?? 0;
  const currentCycleId = poxInfo?.current_cycle.id;
  const rewardCycles = Array.from(
    new Set([
      ...cycles.map(c => c.cycle_number),
      ...(currentCycleId === undefined ? [] : [currentCycleId]),
    ])
  ).filter(cycle => pox5FirstCycleId !== undefined && cycle >= pox5FirstCycleId);
  const featuredIndex = getFeaturedBondIndex(bonds);
  const heights = bonds.flatMap(bond =>
    Object.values(
      getBondSchedule(
        bond.schedule.activation.bitcoin_height,
        bond.schedule.unlock.bitcoin_height,
        rewardCycleLength,
        prepareCycleLength
      )
    )
  );
  heights.push(
    ...cycles.flatMap(cycle => [
      firstBurnchainBlockHeight + cycle.cycle_number * rewardCycleLength,
      firstBurnchainBlockHeight + (cycle.cycle_number + 1) * rewardCycleLength,
    ])
  );
  const [
    cycleRewards,
    rewarded,
    activity,
    enrollments,
    featuredDetail,
    burnBlockTimes,
    prices,
    currentCycleEstimate,
  ] = await Promise.all([
    poxInfo?.contract_id && rewardCycles.length
      ? load(
          fetchCycleRewards(rewardCycles, poxInfo.contract_id, chain, api),
          'Staking page: cycle rewards',
          chain
        )
      : undefined,
    poxInfo?.contract_id
      ? load(fetchBondRewards(poxInfo.contract_id, chain, api), 'Staking page: bond rewards', chain)
      : undefined,
    poxInfo?.contract_id
      ? load(
          fetchStakingActivity(
            poxInfo.contract_id,
            chain,
            api,
            ACTIVITY_FEED_LIMIT,
            selectedActivityGroup
          ),
          'Staking page: activity',
          chain
        )
      : undefined,
    featuredIndex !== undefined
      ? load(fetchBondRegistrations(featuredIndex, chain, api), 'Staking page: enrollments', chain)
      : undefined,
    featuredIndex !== undefined
      ? load(fetchBond(featuredIndex, chain, api), 'Staking page: bond setup', chain)
      : undefined,
    fetchBurnBlockTimes(heights, currentBurnHeight, chain, api),
    cycles.length && rewardCycleLength
      ? load(
          fetchDailyPrices(
            burnHeightToApproximateTimestamp(
              firstBurnchainBlockHeight +
                Math.min(...cycles.map(cycle => cycle.cycle_number)) * rewardCycleLength,
              currentBurnHeight,
              nowMs
            ),
            nowMs
          ),
          'Staking page: daily prices',
          chain
        )
      : undefined,
    poxInfo?.contract_id.split('.')[1] === 'pox-5' && rewardCycles.length
      ? load(
          fetchCurrentCycleEstimate(poxInfo, bonds, chain, api),
          'Staking page: reward estimate',
          chain
        )
      : undefined,
  ]);
  return (
    <StakingPageClient
      currentCycleEstimate={currentCycleEstimate}
      prices={prices}
      bonds={bonds.map(bond => (bond.index === featuredDetail?.index ? featuredDetail : bond))}
      bondsUnavailable={bondsPage === undefined}
      poxInfo={poxInfo}
      cycles={cycles}
      cycleRewards={cycleRewards ?? {}}
      pox5FirstCycleId={pox5FirstCycleId}
      currentBurnHeight={currentBurnHeight}
      rewardCycleLength={rewardCycleLength}
      prepareCycleLength={prepareCycleLength}
      firstBurnchainBlockHeight={firstBurnchainBlockHeight}
      nowMs={nowMs}
      burnBlockTimes={burnBlockTimes}
      enrollments={enrollments?.map(enrollment => ({ btc: enrollment.balances.btc }))}
      activity={activity?.events ?? []}
      activityUnavailable={activity === undefined || activity.incomplete}
      rewarded={rewarded}
      selectedActivityGroup={selectedActivityGroup}
    />
  );
}
