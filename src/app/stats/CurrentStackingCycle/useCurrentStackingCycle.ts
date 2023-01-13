import { useGlobalContext } from '@/common/context/useAppContext';
import { MICROSTACKS_IN_STACKS } from '@/common/utils';
import { useQuery } from 'react-query';

export const useCurrentStackingCycle = () => {
  const { url: activeNetworkUrl } = useGlobalContext().activeNetwork;

  const { data: poxData } = useQuery(
    'pox-info-raw',
    () => fetch(`${activeNetworkUrl}/v2/pox`).then(res => res.json()),
    {
      suspense: true,
      staleTime: 30 * 60 * 1000,
    }
  );
  const numberOfTenMinutesInDay = (24 * 60) / 10;
  const { current_cycle, next_reward_cycle_in, next_cycle } = poxData || {};
  const currentCycleStackedSTX = (current_cycle?.stacked_ustx || 0) / MICROSTACKS_IN_STACKS;
  const blocksTilNextCycle = next_reward_cycle_in || 0;
  const blocksTilNextCyclePreparePhase = next_cycle?.blocks_until_prepare_phase || 0;
  const blocksTilNextCycleRewardPhase = next_cycle?.blocks_until_reward_phase || 0;
  const approximateDaysTilNextCycle = Math.floor(blocksTilNextCycle / numberOfTenMinutesInDay);
  const approximateDaysTilNextCyclePreparePhase = Math.floor(
    blocksTilNextCyclePreparePhase / numberOfTenMinutesInDay
  );
  const approximateDaysTilNextCycleRewardPhase = Math.floor(
    blocksTilNextCycleRewardPhase / numberOfTenMinutesInDay
  );
  const displayPreparePhaseInfo = approximateDaysTilNextCyclePreparePhase > 0;
  return {
    currentCycleStackedSTX,
    blocksTilNextCycle,
    approximateDaysTilNextCycle,
  };
};
