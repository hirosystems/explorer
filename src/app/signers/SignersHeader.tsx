import { Box } from '@/ui/Box';
import { Grid } from '@/ui/Grid';
import { ArrowRight } from '@phosphor-icons/react';
import { ReactNode, useState } from 'react';

import { Card } from '../../common/components/Card';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { CurrentCycleCard } from './CurrentCycle';
import { NextCycleCard } from './NextCycleCard';
import { SignersDistribution } from './SignerDistribution';
import { SignerDistributionHeader } from './SignerDistributionHeader';
import { SignersMapCard } from './SignersMapCard';
import { StxStackedCard } from './StxStackedCard';
import { TotalStackedCard } from './TotalStackedCard';

export function SignersHeaderLayout({
  stackingHeader,
  currentCycleCard,
  stxStakedCard,
  stxLockedCard,
  nextCycleCard,
  signerDistributionHeader,
  signerDistribution,
  signersMap,
}: {
  stackingHeader: ReactNode;
  currentCycleCard: ReactNode;
  stxStakedCard: ReactNode;
  stxLockedCard: ReactNode;
  nextCycleCard: ReactNode;
  signerDistributionHeader: ReactNode;
  signerDistribution: ReactNode;
  signersMap: ReactNode;
  historicalStackingDataLink: ReactNode;
}) {
  return (
    <Card width="full" flexDirection="column" gap={4}>
      <Stack py={8}>
        <Box px={8}>{signerDistributionHeader}</Box>
        <Grid gridTemplateColumns={['100%', '100%', '100%', '100%', 'repeat(2, 1fr)']} gap={8}>
          <Box
            height={500}
            paddingBottom={[0, 0, 0, 7, 7]}
            paddingLeft={7}
            paddingRight={[7, 7, 7, 7, 0]}
          >
            {signerDistribution}
          </Box>
          <Box
            height={500}
            paddingBottom={[0, 0, 0, 7, 7]}
            paddingRight={7}
            paddingLeft={[7, 7, 7, 7, 0]}
          >
            {signersMap}
          </Box>
        </Grid>
        <Box
          width="100%"
          border="1px solid var(--stacks-colors-borderSecondary)"
          display={['none', 'none', 'none', 'none', 'block']}
        />
        <Stack width="full" gap={4} pt={7} px={7}>
          <Flex height={6} alignItems="center">
            {stackingHeader}
          </Flex>
          <Grid
            gridTemplateColumns={[
              '100%',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
            ]}
            width="100%"
            gap={4}
            boxSizing="border-box"
          >
            {currentCycleCard}
            {stxStakedCard}
            {stxLockedCard}
            {nextCycleCard}
          </Grid>
        </Stack>
      </Stack>

      {/* {historicalStackingDataLink} TODO: Add back when the stacking page is done */}
    </Card>
  );
}

export function SignersHeader({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const [onlyShowPublicSigners, setOnlyShowPublicSigners] = useState(false);

  return (
    <SignersHeaderLayout
      stackingHeader={
        <Text fontSize="xs" fontWeight="semibold">
          STACKING
        </Text>
      }
      currentCycleCard={<CurrentCycleCard />}
      stxStakedCard={<StxStackedCard tokenPrice={tokenPrice} />}
      stxLockedCard={<TotalStackedCard />}
      nextCycleCard={<NextCycleCard />}
      signerDistributionHeader={
        <SignerDistributionHeader
          signerTitle="SIGNER DISTRIBUTION"
          onlyShowPublicSigners={onlyShowPublicSigners}
          setOnlyShowPublicSigners={setOnlyShowPublicSigners}
        />
      }
      signerDistribution={<SignersDistribution onlyShowPublicSigners={onlyShowPublicSigners} />}
      historicalStackingDataLink={
        <Flex alignItems="center">
          <Link href="/" color="textSubdued" fontSize="xs" mr={1}>
            See Stacking historical data
          </Link>
          <Icon as={ArrowRight} size={'12px'} color="textSubdued" />
        </Flex>
      }
      signersMap={<SignersMapCard />}
    />
  );
}
