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
import { useSuspenseNextStackingCycle } from './useNextStackingCycle';

function NextStackingCycleBase(props: GridProps) {
  const {
    nextCycleStackedSTX,
    approximateDaysTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    approximateDaysTilNextCyclePreparePhase,
  } = useSuspenseNextStackingCycle();
  const nextCycleCaption = useMemo(() => {
    return (
      <Flex fontSize={'12px'} color={'textTitle'} fontWeight="500" alignItems={'center'}>
        <Text fontSize={'12px'} color={'textCaption'}>
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
          <Flex alignItems={'center'}>
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
  return (
    <StackingCycle
      title="Next Stacking Cycle"
      stackedSTX={nextCycleStackedSTX}
      caption={nextCycleCaption}
      {...props}
    />
  );
}

export function NextStackingCycle(props: GridProps) {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <NextStackingCycleBase {...props} />
    </ExplorerErrorBoundary>
  );
}
