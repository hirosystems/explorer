import { useSuspenseStxSupply } from '@/common/queries/useStxSupply';
import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { numberToString } from '../../common/utils/utils';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { StatCardBase } from './StatsCardBase';
import { SignersStatsSectionSkeleton } from './skeleton';

export function TotalStackedCardBase() {
  const {
    data: { total_stx, unlocked_percent },
  } = useSuspenseStxSupply();
  console.log({ unlocked_percent });

  const stxStackedPercentageFormatted = `${(100 - Number(unlocked_percent)).toFixed(2)}%`;

  return (
    <StatCardBase
      statTitle="Total stacked"
      statValue={stxStackedPercentageFormatted}
      moreInfo={`/ ${numberToString(Number(total_stx))} circulating supply`}
    />
  );
}

export function TotalStackedCard() {
  return (
    <ExplorerErrorBoundary Wrapper={Card} tryAgainButton>
      <Suspense fallback={<SignersStatsSectionSkeleton />}>
        <TotalStackedCardBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
