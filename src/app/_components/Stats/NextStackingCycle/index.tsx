'use client';

import { Flex, Icon, StackProps } from '@chakra-ui/react';
import { Info } from '@phosphor-icons/react';
import { useMemo } from 'react';

import { Text } from '../../../../ui/Text';
import { Tooltip } from '../../../../ui/Tooltip';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { StackingCycle } from '../StackingCycle';
import { StatSection } from '../StatSection';
import { useSuspenseNextStackingCycle } from './useNextStackingCycle';

function NextStackingCycleBase(props: StackProps) {
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
      <Flex alignItems={'center'}>
        <Text>{displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in</Text>
        &nbsp;
        <Tooltip
          content={`${displayPreparePhaseInfo ? 'Prepare' : 'Reward'} phase starts in ${
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
            <Icon h={3} w={3}>
              <Info />
            </Icon>
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

export function NextStackingCycle(props: StackProps) {
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
