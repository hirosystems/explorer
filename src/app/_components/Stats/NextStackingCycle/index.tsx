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
import { useNextStackingCycle } from './useNextStackingCycle';

function NextStackingCycleBase(props: GridProps) {
  const {
    nextCycleStackedSTX,
    approximateDaysTilNextCycleRewardPhase,
    displayPreparePhaseInfo,
    blocksTilNextCyclePreparePhase,
    blocksTilNextCycleRewardPhase,
    approximateDaysTilNextCyclePreparePhase,
  } = useNextStackingCycle();
  const nextCycleCaption = useMemo(() => {
    return (
      <Flex alignItems={'center'}>
        <Text>{displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in</Text>
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
            <Icon as={Info} size={3} />
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
  if (!nextCycleStackedSTX) return <SkeletonStatSection />;
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
    <ExplorerErrorBoundary
      renderContent={() => (
        <StatSection
          title={'Next Stacking Cycle'}
          bodyMainText={'-'}
          bodySecondaryText={<Text ml={1}>STX stacked</Text>}
          caption={'N/A'}
        />
      )}
    >
      <NextStackingCycleBase {...props} />
    </ExplorerErrorBoundary>
  );
}
