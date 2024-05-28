import { ReactNode, Suspense } from 'react';

import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignersDistributionLegend } from './SignerDistributionLegend';
import { SignersDistributionPieChart } from './SignerDistributionPieChart';
import { useSuspensePoxSigners } from './data/useSigners';
import { SignersDistributionSkeleton } from './skeleton';

export function SignersDistributionLayout({
  signersDistributionPieChart,
  signersDistributionLegend,
}: {
  signersDistributionPieChart: ReactNode;
  signersDistributionLegend: ReactNode;
}) {
  return (
    <Card padding={6} height="100%">
      <Flex height="100%" width="100%" justifyContent="center" alignItems="center">
        <Grid
          height="100%"
          width="100%"
          templateColumns={['100%', '100%', '50% 50%', '100%', '100%']}
        >
          <Flex justifyContent="center" alignItems="center" height="100%" width="100%">
            <Box height="99%" width="99%">
              {signersDistributionPieChart}
            </Box>
          </Flex>
          <Box display={['block', 'block', 'block', 'none', 'none']}>
            {signersDistributionLegend}
          </Box>
        </Grid>
      </Flex>
    </Card>
  );
}

export function SignersDistributionBase({
  onlyShowPublicSigners = false,
}: {
  onlyShowPublicSigners?: boolean;
}) {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);

  return (
    <SignersDistributionLayout
      signersDistributionPieChart={
        <SignersDistributionPieChart
          signers={signers}
          onlyShowPublicSigners={onlyShowPublicSigners}
        />
      }
      signersDistributionLegend={
        <SignersDistributionLegend
          signers={signers}
          onlyShowPublicSigners={onlyShowPublicSigners}
        />
      }
    />
  );
}

export function SignersDistribution({
  onlyShowPublicSigners = false,
}: {
  onlyShowPublicSigners?: boolean;
}) {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <Suspense fallback={<SignersDistributionSkeleton />}>
        <SignersDistributionBase onlyShowPublicSigners={onlyShowPublicSigners} />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
