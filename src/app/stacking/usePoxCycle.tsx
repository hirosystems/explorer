import { NUM_SECONDS_IN_TEN_MINUTES } from '@/common/constants/constants';
import { useBlockByHeight } from '@/common/queries/useBlockByHeight';
import { useSuspensePoxInfoRaw } from '@/common/queries/usePoxInforRaw';

export interface PoxCycleInfo {
  currentBurnChainBlockHeight: number;
  currentBlockDate: Date | undefined;
  preparePhaseBlockLength: number;
  rewardCycleLength: number;
  blocksUntilPreparePhase: number;
  blocksUntilRewardPhase: number;
  nextRewardCycleIn: number;
  nextCycleId: number;
  currentCycleId: number;
  nextCycleStackedStx: number;
  currentCycleStackedStx: number;
  cycleBlockLength: number;
  progressInBlocks: number;
  currentCycleBurnChainBlockHeightStart: number;
  progressPercentageForCurrentCycle: number;
  progressPercentageForNextCycle: number;
  prepareCycleProgress: number;
  blocksTilNextCycle: number;
  approximateSecondsTilNextCycle: number;
  approximateNextCycleDate: Date;
  approximateSecondsTilNextCyclePreparePhase: number;
  preparePhaseDate: Date;
  preparePhaseBurnBlockHeightStart: number;
  rewardPhaseBurnBlockHeightStart: number;
}

export function usePoxCycle(): PoxCycleInfo {
  const { data: poxInfo } = useSuspensePoxInfoRaw();

  const currentBurnChainBlockHeight = poxInfo.current_burnchain_block_height;
  const { data: currentBlockData } = useBlockByHeight(currentBurnChainBlockHeight);
  const currentBlockDate = currentBlockData?.block_time_iso
    ? new Date(currentBlockData.block_time_iso)
    : undefined;

  // const nextCycleRewardPhaseBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const preparePhaseBlockLength = poxInfo.prepare_phase_block_length;
  // const rewardPhaseBlockLength = poxInfo.reward_phase_block_length;
  // const prepareCycleLength = poxInfo.prepare_cycle_length;
  const rewardCycleLength = poxInfo.reward_cycle_length;
  // const preparePhaseStartBlockHeight = poxInfo.next_cycle.prepare_phase_start_block_height;
  const blocksUntilPreparePhase = poxInfo.next_cycle.blocks_until_prepare_phase;
  const blocksUntilRewardPhase = poxInfo.next_cycle.blocks_until_reward_phase;
  // const rewardPhaseStartBlockHeight = poxInfo.next_cycle.reward_phase_start_block_height;
  const nextRewardCycleIn = poxInfo.next_reward_cycle_in;

  const nextCycleId = poxInfo.next_cycle.id;
  const currentCycleId = poxInfo.current_cycle.id;
  const nextCycleStackedStx = poxInfo.next_cycle.stacked_ustx / 1000000;
  const currentCycleStackedStx = poxInfo.current_cycle.stacked_ustx / 1000000;

  const cycleBlockLength = rewardCycleLength;
  const progressInBlocks = cycleBlockLength - 1 - blocksUntilRewardPhase;
  const currentCycleBurnChainBlockHeightStart = currentBurnChainBlockHeight - progressInBlocks;
  console.log({
    currentCycleBurnChainBlockHeightStart,
    currentBurnChainBlockHeight,
    progressInBlocks,
  });
  //   const progressPercentageForCurrentCycle = progressInBlocks / cycleBlockLength;
  const progressPercentageForCurrentCycle = 0.15;

  const progressPercentageForNextCycle = blocksUntilRewardPhase === 0 ? 1 : 0;
  const prepareCycleProgress = (cycleBlockLength - preparePhaseBlockLength) / cycleBlockLength;

  const blocksTilNextCycle = nextRewardCycleIn || 0;
  const approximateSecondsTilNextCycle = Math.floor(
    blocksTilNextCycle * NUM_SECONDS_IN_TEN_MINUTES
  );
  const approximateNextCycleDate = new Date(
    new Date().getTime() + approximateSecondsTilNextCycle * 1000
  );

  const approximateSecondsTilNextCyclePreparePhase = Math.floor(
    blocksUntilPreparePhase * NUM_SECONDS_IN_TEN_MINUTES
  );
  const preparePhaseDate = new Date(
    new Date().getTime() + approximateSecondsTilNextCyclePreparePhase * 1000
  );
  const preparePhaseBurnBlockHeightStart = currentBurnChainBlockHeight + blocksUntilPreparePhase;

  const rewardPhaseBurnBlockHeightStart = currentBurnChainBlockHeight + blocksUntilRewardPhase;

  return {
    currentBurnChainBlockHeight,
    currentBlockDate,
    preparePhaseBlockLength,
    rewardCycleLength,
    blocksUntilPreparePhase,
    blocksUntilRewardPhase,
    nextRewardCycleIn,
    nextCycleId,
    currentCycleId,
    nextCycleStackedStx,
    currentCycleStackedStx,
    cycleBlockLength,
    progressInBlocks,
    currentCycleBurnChainBlockHeightStart,
    progressPercentageForCurrentCycle,
    progressPercentageForNextCycle,
    prepareCycleProgress,
    blocksTilNextCycle,
    approximateSecondsTilNextCycle,
    approximateNextCycleDate,
    approximateSecondsTilNextCyclePreparePhase,
    preparePhaseDate,
    preparePhaseBurnBlockHeightStart,
    rewardPhaseBurnBlockHeightStart,
  };
}
