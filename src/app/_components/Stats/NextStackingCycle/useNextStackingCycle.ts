import { usePoxInfoRaw, useSuspensePoxInfoRaw } from '../../../../common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '../../../../common/utils/utils';

function getNextCycleInfo(poxData: any) {
  if (!poxData) {
    return {
      nextCycleStackedSTX: 0,
      approximateDaysTilNextCycleRewardPhase: 0,
      displayPreparePhaseInfo: false,
      blocksTilNextCyclePreparePhase: 0,
      blocksTilNextCycleRewardPhase: 0,
      approximateDaysTilNextCyclePreparePhase: 0,
    };
  }
  const { next_cycle } = poxData || {};
  const nextCycleStackedSTX = (next_cycle?.stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const blocksTilNextCyclePreparePhase = next_cycle?.blocks_until_prepare_phase || 0;
  const blocksTilNextCycleRewardPhase = next_cycle?.blocks_until_reward_phase || 0;

  const numberOfTenMinutesInDay = (24 * 60) / 10;
  const approximateDaysTilNextCyclePreparePhase = Math.floor(
    blocksTilNextCyclePreparePhase / numberOfTenMinutesInDay
  );
  const approximateDaysTilNextCycleRewardPhase = Math.floor(
    blocksTilNextCycleRewardPhase / numberOfTenMinutesInDay
  );
  const displayPreparePhaseInfo = approximateDaysTilNextCyclePreparePhase > 0;
  return {
    nextCycleStackedSTX,
    approximateDaysTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    approximateDaysTilNextCyclePreparePhase,
  };
}

export function useNextStackingCycle() {
  const { data: poxData } = usePoxInfoRaw();
  return getNextCycleInfo(poxData);
}

export function useSuspenseNextStackingCycle() {
  const { data: poxData } = useSuspensePoxInfoRaw();
  return getNextCycleInfo(poxData);
}
