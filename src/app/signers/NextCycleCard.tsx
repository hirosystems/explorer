import pluralize from 'pluralize';
import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';
import BitcoinIcon from '../../ui/icons/BitcoinIcon';
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
    <Text lineHeight={4} fontSize="xs" fontWeight="medium" color="textSubdued">
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
            <Icon as={BitcoinIcon} size={3} />
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
          <Icon as={BitcoinIcon} size={3} />
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
