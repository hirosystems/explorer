import { Box, Icon } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { Text } from '../../ui/Text';
import BitcoinCircleIcon from '../../ui/icons/BitcoinCircleIcon';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';
import { StatCardBase } from './StatsCardBase';
import { SignersStatsSectionSkeleton } from './skeleton';

export function NextCycleCardBase() {
  const {
    nextRewardCycleId,
    preparePhaseBurnBlockHeightStart,
    rewardPhaseBurnBlockHeightStart,
    displayPreparePhaseInfo,
    approximateDaysTilNextCyclePreparePhase,
    approximateDaysTilNextCycleRewardPhase,
  } = useSuspenseNextStackingCycle();

  const moreInfo = (
    <Text fontSize="xs" fontWeight="medium" color="textSubdued">
      {displayPreparePhaseInfo ? (
        <Box>
          <Text display="inline">
            {`Prepare starts in ~${approximateDaysTilNextCyclePreparePhase} ${pluralize(
              'day',
              approximateDaysTilNextCyclePreparePhase
            )} at`}
            &nbsp;
          </Text>
          <Text display="inline" whiteSpace="nowrap">
            <Icon h={3} w={3} color="accent.bitcoin-500">
              <BitcoinCircleIcon />
            </Icon>
            &nbsp;{`#${preparePhaseBurnBlockHeightStart}`}
          </Text>
        </Box>
      ) : null}
      <Box>
        <Text display="inline">
          {`Reward Phase starts in ~${approximateDaysTilNextCycleRewardPhase} ${pluralize(
            'day',
            approximateDaysTilNextCycleRewardPhase
          )}
        at`}
          &nbsp;
        </Text>
        <Text display="inline" whiteSpace="nowrap">
          <Icon h={3} w={3} color="accent.bitcoin-500">
            <BitcoinCircleIcon />
          </Icon>
          &nbsp;{`#${rewardPhaseBurnBlockHeightStart}`}
        </Text>
      </Box>
    </Text>
  );

  return (
    <StatCardBase
      statTitle="Next cycle"
      statValue={nextRewardCycleId.toString()}
      moreInfo={moreInfo}
    />
  );
}

export function NextCycleCard() {
  return (
    <ExplorerErrorBoundary Wrapper={Card} tryAgainButton>
      <Suspense fallback={<SignersStatsSectionSkeleton />}>
        <NextCycleCardBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
