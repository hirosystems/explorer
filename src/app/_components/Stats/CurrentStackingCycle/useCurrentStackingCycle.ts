import { usePoxInfoRaw, useSuspensePoxInfoRaw } from '../../../../common/queries/usePoxInforRaw';
import { MICROSTACKS_IN_STACKS } from '../../../../common/utils/utils';

function getCurrentCycleInfo(poxData: any) {
  if (!poxData) {
    return {
      currentCycleStackedSTX: 0,
      blocksTilNextCycle: 0,
      approximateDaysTilNextCycle: 0,
    };
  }
  const numberOfTenMinutesInDay = (24 * 60) / 10;
  const { current_cycle, next_reward_cycle_in, next_cycle } = poxData || {};
  const currentCycleStackedSTX = (current_cycle?.stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const blocksTilNextCycle = next_reward_cycle_in || 0;
  const approximateDaysTilNextCycle = Math.floor(blocksTilNextCycle / numberOfTenMinutesInDay);
  return {
    currentCycleStackedSTX,
    blocksTilNextCycle,
    approximateDaysTilNextCycle,
  };
}

export function useCurrentStackingCycle() {
  const { data: poxData } = usePoxInfoRaw();
  return getCurrentCycleInfo(poxData);
}

export function useSuspenseCurrentStackingCycle() {
  const { data: poxData } = useSuspensePoxInfoRaw();
  return getCurrentCycleInfo(poxData);
}
