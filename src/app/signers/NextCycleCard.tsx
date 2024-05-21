import pluralize from 'pluralize';
import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
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
    nextCycleBurnBlockHeightStart,
    displayPreparePhaseInfo,
    approximateDaysTilNextCyclePreparePhase,
    approximateDaysTilNextCycleRewardPhase,
  } = useSuspenseNextStackingCycle();

  const moreInfo = (
    <Text lineHeight={4} fontSize="xs" fontWeight="medium" color="textSubdued">
      <Text display="inline">
        {`Starts in ~${
          displayPreparePhaseInfo
            ? approximateDaysTilNextCyclePreparePhase
            : approximateDaysTilNextCycleRewardPhase
        } ${pluralize(
          'day',
          displayPreparePhaseInfo
            ? approximateDaysTilNextCyclePreparePhase
            : approximateDaysTilNextCycleRewardPhase
        )}
        at`}
        &nbsp;
      </Text>
      <Text display="inline" whiteSpace="nowrap">
        <Icon as={BitcoinIcon} size={3} />
        &nbsp;{`#${nextCycleBurnBlockHeightStart}`}
      </Text>
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
