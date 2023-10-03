import { useMemo } from 'react';
import { SkeletonStatSection } from '@/appPages/stats/SkeletonStatSection';
import { InfoCircleIcon } from '@/components/icons/info-circle';
import { Flex, GridProps, Tooltip } from '@/ui/components';
import { Text } from '@/ui/typography';

import { StackingCycle } from '../StackingCycle';
import { useCurrentStackingCycle } from './useCurrentStackingCycle';

export function CurrentStackingCycle(props: GridProps) {
  const { currentCycleStackedSTX, blocksTilNextCycle, approximateDaysTilNextCycle, isFetching } =
    useCurrentStackingCycle();
  const currentCycleCaption = useMemo(() => {
    if (!blocksTilNextCycle) return null;
    return (
      <Flex fontSize="12px" color="textTitle" fontWeight="500" alignItems="center">
        <Text fontSize="12px" color="textCaption">
          Next cycle starts in
        </Text>
        &nbsp;
        <Tooltip
          label={`Next cycle starts in ${blocksTilNextCycle} block${
            blocksTilNextCycle !== 1 ? 's' : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems="center">
            {approximateDaysTilNextCycle} day{approximateDaysTilNextCycle !== 1 ? 's' : ''}
            &nbsp;
            <InfoCircleIcon width="18px" height="18px" />
          </Flex>
        </Tooltip>
      </Flex>
    );
  }, [approximateDaysTilNextCycle, blocksTilNextCycle]);
  if (isFetching) {
    return <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />;
  }
  return (
    <StackingCycle
      title="Current Stacking Cycle"
      stackedSTX={currentCycleStackedSTX}
      caption={currentCycleCaption}
      {...props}
    />
  );
}
