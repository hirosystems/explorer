import { useSuspensePoxInfoRaw } from '../../../../common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '../../../../common/utils/utils';

export function useSuspenseNextStackingCycle() {
  const { data: poxData } = useSuspensePoxInfoRaw();
  const {
    current_burnchain_block_height: currentBurnchainBlockHeight,
    next_cycle: {
      stacked_ustx,
      blocks_until_prepare_phase,
      blocks_until_reward_phase,
      id: nextRewardCycleId,
    },
    reward_cycle_id: currentRewardCycleId,
  } = poxData || {};
  const nextCycleStackedSTX = (stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const blocksTilNextCyclePreparePhase = blocks_until_prepare_phase || 0;
  const blocksTilNextCycleRewardPhase = blocks_until_reward_phase || 0;
  const preparePhaseBurnBlockHeightStart =
    currentBurnchainBlockHeight + blocksTilNextCyclePreparePhase;
  const rewardPhaseBurnBlockHeightStart =
    currentBurnchainBlockHeight + blocksTilNextCycleRewardPhase;

  const numberOfTenMinutesInDay = (24 * 60) / 10;
  const approximateDaysTilNextCyclePreparePhase = Math.floor(
    blocksTilNextCyclePreparePhase / numberOfTenMinutesInDay
  );
  const approximateDaysTilNextCycleRewardPhase = Math.floor(
    blocksTilNextCycleRewardPhase / numberOfTenMinutesInDay
  );
  const displayPreparePhaseInfo = approximateDaysTilNextCyclePreparePhase > 0;
  return {
    currentRewardCycleId,
    nextRewardCycleId,
    nextCycleStackedSTX,
    approximateDaysTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    approximateDaysTilNextCyclePreparePhase,
    preparePhaseBurnBlockHeightStart,
    rewardPhaseBurnBlockHeightStart,
  };
}
