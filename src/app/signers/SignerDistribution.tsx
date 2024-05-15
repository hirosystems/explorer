import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignersDistributionLegend } from './SignerDistributionLegend';
import { SignersDistributionPieChart } from './SignerDistributionPieChart';
import { useSuspensePoxSigners } from './data/useSigners';

export function SignersDistribution({
  onlyShowPublicSigners = false,
}: {
  onlyShowPublicSigners?: boolean;
}) {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);

  return (
    <Card padding={6} height="100%">
      <Flex height="100%" width="100%" justifyContent="center" alignItems="center">
        <Grid
          height="100%"
          width="100%"
          templateColumns={['100%', '100%', '50% 50%', '100%', '100%']}
        >
          <Flex justifyContent="center" alignItems="center" height="100%" width="100%">
            <Box height="360px" width="100%">
              <SignersDistributionPieChart
                signers={signers}
                onlyShowPublicSigners={onlyShowPublicSigners}
              />
            </Box>
          </Flex>
          <Box display={['block', 'block', 'block', 'none', 'none']}>
            <SignersDistributionLegend
              signers={signers}
              onlyShowPublicSigners={onlyShowPublicSigners}
            />
          </Box>
        </Grid>
      </Flex>
    </Card>
  );
}
