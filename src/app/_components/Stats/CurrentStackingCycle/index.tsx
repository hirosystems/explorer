'use client';

import * as React from 'react';
import { useMemo } from 'react';

import { InfoCircleIcon } from '../../../../common/components/icons/info-circle';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { GridProps } from '../../../../ui/Grid';
import { Text } from '../../../../ui/Text';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StackingCycle } from '../StackingCycle';
import { useSuspenseCurrentStackingCycle } from './useCurrentStackingCycle';

function CurrentStackingCycleBase(props: GridProps) {
  const { currentCycleStackedSTX, blocksTilNextCycle, approximateDaysTilNextCycle } =
    useSuspenseCurrentStackingCycle();
  const currentCycleCaption = useMemo(() => {
    if (!blocksTilNextCycle) return null;
    return (
      <Flex fontSize={'12px'} color={'textTitle'} fontWeight="500" alignItems={'center'}>
        <Text fontSize={'12px'} color={'textCaption'}>
          Next cycle starts in
        </Text>
        &nbsp;
        <Tooltip
          label={`Next cycle starts in ${blocksTilNextCycle} block${
            blocksTilNextCycle !== 1 ? 's' : ''
          }. Calculation is based on ~10 minutes block time.`}
        >
          <Flex alignItems={'center'}>
            {approximateDaysTilNextCycle} day{approximateDaysTilNextCycle !== 1 ? 's' : ''}
            &nbsp;
            <InfoCircleIcon width="18px" height="18px" />
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
      Wrapper={Box}
      wrapperProps={{ borderRightWidth: ['0px', '0px', '1px', '1px'] }}
      tryAgainButton
    >
      <CurrentStackingCycleBase {...props} />
    </ExplorerErrorBoundary>
  );
}
