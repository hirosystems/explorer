import { ArrowRight } from '@phosphor-icons/react';
import { ReactNode, useState } from 'react';

import { Card } from '../../common/components/Card';
import { TokenPrice } from '../../common/types/tokenPrice';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { AddressesStackingCard } from './AddressesStackingCard';
import { CurrentCycleCard } from './CurrentCycle';
import { NextCycleCard } from './NextCycleCard';
import { SignersDistribution } from './SignerDistribution';
import { SignerDistributionHeader } from './SignerDistributionHeader';
import { StxStackedCard } from './StxStackedCard';
import { TotalStackedCard } from './TotalStackedCard';

export function SignersHeaderLayout({
  stackingTitle,
  currentCycleCard,
  stxStakedCard,
  stxLockedCard,
  addressesStackingCard,
  nextCycleCard,
  signerDistribution,
  signerDistributionHeader,
}: {
  stackingTitle: ReactNode;
  currentCycleCard: ReactNode;
  stxStakedCard: ReactNode;
  stxLockedCard: ReactNode;
  addressesStackingCard: ReactNode;
  nextCycleCard: ReactNode;
  signerDistributionHeader: ReactNode;
  signerDistribution: ReactNode;
  historicalStackingDataLink: ReactNode;
}) {
  return (
    <Card width="full" flexDirection="column" gap={4}>
      <Stack display="flex" flexDirection={['column', 'column', 'column', 'row', 'row']} gap={8}>
        <Stack
          width="full"
          gap={4}
          paddingTop={7}
          paddingBottom={[0, 0, 0, 7, 7]}
          paddingLeft={7}
          paddingRight={[7, 7, 7, 0, 0]}
        >
          {signerDistributionHeader}
          {signerDistribution}
        </Stack>
        <Box
          width="1px"
          border="1px solid var(--stacks-colors-borderSecondary)"
          display={['none', 'none', 'none', 'block', 'block']}
          margin={0}
        />
        <Stack
          width="full"
          gap={4}
          paddingY={7}
          paddingRight={7}
          paddingLeft={[7, 7, 7, 0, 0]}
          paddingBottom={7}
          paddingTop={[0, 0, 0, 7, 7]}
        >
          <Flex height={6} alignItems="center">
            <Text fontSize="xs" fontWeight="semibold">
              {stackingTitle}
            </Text>
          </Flex>
          <Box
            display={['grid', 'grid', 'none', 'grid', 'grid']}
            gridTemplateColumns="repeat(2, 1fr)"
            width="100%"
            gap={4}
            boxSizing="border-box"
          >
            <Box gridColumn={['span 2', 'span 2', 'span 1', 'span 2', 'span 2']}>
              {currentCycleCard}
            </Box>
            {stxStakedCard}
            {stxLockedCard}
            {addressesStackingCard}
            {nextCycleCard}
          </Box>
          <Stack width="100%" display={['none', 'none', 'flex', 'none', 'none']} gap={4}>
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" width="100%" gap={4}>
              {currentCycleCard}
              {stxStakedCard}
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" width="100%" gap={4}>
              {stxLockedCard}
              {addressesStackingCard}
              {nextCycleCard}
            </Box>
          </Stack>
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
      stackingTitle="STACKING"
      currentCycleCard={<CurrentCycleCard />}
      stxStakedCard={<StxStackedCard tokenPrice={tokenPrice} />}
      stxLockedCard={<TotalStackedCard />}
      addressesStackingCard={<AddressesStackingCard />}
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
    />
  );
}
