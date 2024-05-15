import { Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { numberToString } from '../../common/utils/utils';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { StatCardBase } from './StatsCardBase';
import { useStxSupply } from './data/usStxSupply';
import { SignersStatsSectionSkeleton } from './skeleton';

export function TotalStackedCardBase() {
  const { stackedSupply, circulatingSupply } = useStxSupply();

  const stxStackedPercentageFormatted = `${((stackedSupply / circulatingSupply) * 100).toFixed(
    1
  )}%`;

  return (
    <StatCardBase
      statTitle="Total stacked"
      statValue={stxStackedPercentageFormatted}
      moreInfo={`/ ${numberToString(circulatingSupply)} circulating supply`}
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
