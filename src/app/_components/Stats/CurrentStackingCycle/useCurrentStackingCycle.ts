import { useSuspensePoxInforRaw } from '../../../../common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '../../../../common/utils/utils';

const NUM_TEN_MINS_IN_DAY = (24 * 60) / 10;

export function useSuspenseCurrentStackingCycle() {
  const { data: poxData } = useSuspensePoxInforRaw();
  const {
    current_cycle: { id: currentCycleId = 0, stacked_ustx = 0 } = {},
    next_cycle: {
      blocks_until_reward_phase: blocksTilNextCycleRewardPhase = 0,
      blocks_until_prepare_phase: blocksTilNextCyclePreparePhase = 0,
    } = {},
    next_reward_cycle_in,
    reward_cycle_length,
  } = poxData || {};

  const currentCycleStackedSTX = stacked_ustx / MICROSTACKS_IN_STACKS;
  const blocksTilNextCycle = next_reward_cycle_in || 0;
  // const blocksTilNextCyclePreparePhase = blocks_until_prepare_phase || 0;
  // const blocksTilNextCycleRewardPhase = blocks_until_reward_phase || 0;
  const approximateDaysTilNextCycle = Math.floor(blocksTilNextCycle / NUM_TEN_MINS_IN_DAY);
  const currentCycleProgressPercentage =
    (reward_cycle_length - next_reward_cycle_in) / reward_cycle_length;
  const approximateDaysSinceCurrentCycleStart = Math.floor(
    (reward_cycle_length - next_reward_cycle_in) / NUM_TEN_MINS_IN_DAY
  );
  // const approximateDaysTilNextCyclePreparePhase = Math.floor(
  //   blocksTilNextCyclePreparePhase / NUM_TEN_MINS_IN_DAY
  // );
  // const approximateDaysTilNextCycleRewardPhase = Math.floor(
  //   blocksTilNextCycleRewardPhase / NUM_TEN_MINS_IN_DAY
  // );
  // const displayPreparePhaseInfo = approximateDaysTilNextCyclePreparePhase > 0;
  return {
    currentCycleId,
    currentCycleProgressPercentage,
    currentCycleStackedSTX,
    blocksTilNextCycle,
    approximateDaysTilNextCycle,
    approximateDaysSinceCurrentCycleStart,
  };
}
