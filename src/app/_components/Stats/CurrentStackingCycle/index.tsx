'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { PiInfo } from 'react-icons/pi';

import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Icon } from '../../../../ui/Icon';
import { Text } from '../../../../ui/Text';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StackingCycle } from '../StackingCycle';
import { StatSection } from '../StatSection';
import { useSuspenseCurrentStackingCycle } from './useCurrentStackingCycle';

function CurrentStackingCycleBase(props: GridProps) {
  const { currentCycleStackedSTX, blocksTilNextCycle, approximateDaysTilNextCycle } =
    useSuspenseCurrentStackingCycle();
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
            <Icon as={PiInfo} size={3} />
          </Flex>
        </Tooltip>
      </Flex>
    );
  }, [approximateDaysTilNextCycle, blocksTilNextCycle]);
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
