'use client';

import { Info } from '@phosphor-icons/react';
import * as React from 'react';
import { useMemo } from 'react';

import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { SkeletonStatSection } from '../SkeletonStatSection';
import { StackingCycle } from '../StackingCycle';
import { StatSection } from '../StatSection';
import {
  useCurrentStackingCycle,
  useSuspenseCurrentStackingCycle,
} from './useCurrentStackingCycle';

function CurrentStackingCycleBase(props: GridProps) {
  const { currentCycleStackedSTX, blocksTilNextCycle, approximateDaysTilNextCycle } =
    useCurrentStackingCycle();
  const currentCycleCaption = useMemo(() => {
    if (!blocksTilNextCycle) return null;
    return (
      <Flex alignItems={'center'}>
        <Text>Next cycle starts in</Text>
        &nbsp;
        <Tooltip
          label={`Next cycle starts in ${blocksTilNextCycle} block${
            blocksTilNextCycle !== 1 ? 's' : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems={'center'}>
            {approximateDaysTilNextCycle} day{approximateDaysTilNextCycle !== 1 ? 's' : ''}
            &nbsp;
            <Icon as={Info} size={3} />
          </Flex>
        </Tooltip>
      </Flex>
    );
  }, [approximateDaysTilNextCycle, blocksTilNextCycle]);
  if (!currentCycleStackedSTX)
    return <SkeletonStatSection borderRightWidth={['0px', '0px', '1px', '1px']} />;
  return (
    <StackingCycle
      title="Current Stacking Cycle"
      stackedSTX={currentCycleStackedSTX}
      caption={currentCycleCaption}
      {...props}
    />
  );
}

export function CurrentStackingCycle(props: GridProps) {
  return (
    <ExplorerErrorBoundary
      renderContent={() => (
        <StatSection
          title={'Current Stacking Cycle'}
          bodyMainText={'-'}
          bodySecondaryText={<Text ml={1}>STX stacked</Text>}
          caption={'N/A'}
        />
      )}
    >
      <CurrentStackingCycleBase {...props} />
    </ExplorerErrorBoundary>
  );
}
