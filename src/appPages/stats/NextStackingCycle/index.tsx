import { useMemo } from 'react';
import { SkeletonStatSection } from '@/appPages/stats/SkeletonStatSection';
import { InfoCircleIcon } from '@/components/icons/info-circle';
import { Flex, GridProps, Tooltip } from '@/ui/components';
import { Text } from '@/ui/typography';

import { StackingCycle } from '../StackingCycle';
import { useNextStackingCycle } from './useNextStackingCycle';

export function NextStackingCycle(props: GridProps) {
  const {
    nextCycleStackedSTX,
    approximateDaysTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    approximateDaysTilNextCyclePreparePhase,
    isFetching,
  } = useNextStackingCycle();
  const nextCycleCaption = useMemo(() => {
    return (
      <Flex fontSize="12px" color="textTitle" fontWeight="500" alignItems="center">
        <Text fontSize="12px" color="textCaption">
          {displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in
        </Text>
        &nbsp;
        <Tooltip
          label={`${displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in ${
            displayPreparePhaseInfo ? blocksTilNextCyclePreparePhase : blocksTilNextCycleRewardPhase
          } block${
            (displayPreparePhaseInfo
              ? blocksTilNextCyclePreparePhase
              : blocksTilNextCycleRewardPhase) !== 1
              ? 's'
              : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems="center">
            {displayPreparePhaseInfo
              ? approximateDaysTilNextCyclePreparePhase
              : approximateDaysTilNextCycleRewardPhase}{' '}
            day
            {(displayPreparePhaseInfo
              ? approximateDaysTilNextCyclePreparePhase
              : approximateDaysTilNextCycleRewardPhase) !== 1
              ? 's'
              : ''}
            &nbsp;
            <InfoCircleIcon width="18px" height="18px" />
          </Flex>
        </Tooltip>
      </Flex>
    );
  }, [
    approximateDaysTilNextCyclePreparePhase,
    approximateDaysTilNextCycleRewardPhase,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
  ]);
  if (isFetching) {
    return <SkeletonStatSection />;
  }
  return (
    <StackingCycle
      title="Next Stacking Cycle"
      stackedSTX={nextCycleStackedSTX}
      caption={nextCycleCaption}
      {...props}
    />
  );
}
