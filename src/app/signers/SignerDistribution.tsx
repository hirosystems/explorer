import { Box, Flex, Grid, Stack } from '@chakra-ui/react';
import { ReactNode, Suspense, useState } from 'react';

import { Card } from '../../common/components/Card';
import { useSuspenseInfiniteQueryResult } from '../../common/hooks/useInfiniteQueryResult';
import { Text } from '../../ui/Text';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignersDistributionLegend } from './SignerDistributionLegend';
import { SignersDistributionPieChart } from './SignerDistributionPieChart';
import { SignersDistributionFilter } from './SignersDistributionFilter';
import { PoxSigner, useSuspensePoxSigners } from './data/useSigners';
import { SignersDistributionSkeleton } from './skeleton';

export function SignersDistributionLayout({
  signersDistributionPieChart,
  signersDistributionLegend,
  signersDistributionFilter,
}: {
  signersDistributionPieChart: ReactNode;
  signersDistributionLegend: ReactNode;
  signersDistributionFilter: ReactNode;
}) {
  return (
    <Card padding={6} height="100%" width="100%">
      <Grid
        height="100%"
        width="100%"
        templateColumns={['100%', '100%', '50% 50%', '50% 50%', '50% 50%']}
        gap={4}
      >
        <Stack justifyContent="center" alignItems="center" height="100%" width="100%" gap={6}>
          <Flex flex="1" minHeight={0} justifyContent="center" alignItems="center">
            {signersDistributionPieChart}
          </Flex>
          {signersDistributionFilter}
        </Stack>
        <Box mt={[6, 6, 0, 0, 0]}>
          <Flex height="100%" width="100%" alignItems="center" justifyContent="center">
            {signersDistributionLegend}
          </Flex>
        </Box>
      </Grid>
    </Card>
  );
}

export function SignersDistributionBase() {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();

  const signersResponse = useSuspensePoxSigners(currentCycleId, {
    limit: 100,
  });
  const signers = useSuspenseInfiniteQueryResult<PoxSigner>(signersResponse);

  const [onlyShowPublicSigners, setOnlyShowPublicSigners] = useState(false);

  return signers.length > 0 ? (
    <SignersDistributionLayout
      signersDistributionFilter={
        <SignersDistributionFilter
          onlyShowPublicSigners={onlyShowPublicSigners}
          setOnlyShowPublicSigners={setOnlyShowPublicSigners}
        />
      }
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
  ) : (
    <Card display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <Text>No signers found</Text>
    </Card>
  );
}

export function SignersDistribution() {
  return (
    <ExplorerErrorBoundary tryAgainButton>
      <Suspense fallback={<SignersDistributionSkeleton />}>
        <SignersDistributionBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
