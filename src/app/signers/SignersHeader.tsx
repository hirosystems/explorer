import { Box, Grid, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Card } from '../../common/components/Card';
import { SignersDistribution } from './SignerDistribution';
import { SignerDistributionHeader } from './SignerDistributionHeader';
import { SignersMapComponent } from './SignersMapComponent';

export function SignersHeaderLayout({
  signerDistributionHeader,
  signerDistribution,
  signersMap,
}: {
  signerDistributionHeader: ReactNode;
  signerDistribution: ReactNode;
  signersMap: ReactNode;
}) {
  return (
    <Card width="full" flexDirection="column" gap={4}>
      <Stack py={8} gap={4}>
        <Box px={8}>{signerDistributionHeader}</Box>
        <Grid gridTemplateColumns={['100%', '100%', '100%', '100%', 'repeat(2, 1fr)']} gap={8}>
          <Box
            h="auto"
            paddingBottom={[0, 0, 0, 0, 7]}
            paddingLeft={7}
            paddingRight={[7, 7, 7, 7, 0]}
          >
            {signerDistribution}
          </Box>
          <Box
            height={550}
            paddingBottom={[0, 0, 0, 0, 7]}
            paddingRight={7}
            paddingLeft={[7, 7, 7, 7, 0]}
          >
            {signersMap}
          </Box>
        </Grid>
      </Stack>
    </Card>
  );
}

export function SignersHeader() {
  return (
    <SignersHeaderLayout
      signerDistributionHeader={<SignerDistributionHeader signerTitle="SIGNER DISTRIBUTION" />}
      signerDistribution={<SignersDistribution />}
      signersMap={<SignersMapComponent />}
    />
  );
}
