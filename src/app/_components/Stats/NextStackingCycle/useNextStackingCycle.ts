import { useSuspensePoxInforRaw } from '../../../../common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '../../../../common/utils/utils';

export function useSuspenseNextStackingCycle() {
  const { data: poxData } = useSuspensePoxInforRaw();

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
