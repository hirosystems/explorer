import { FormControl } from '@/ui/FormControl';
import { FormLabel } from '@/ui/FormLabel';
import { Switch } from '@/ui/Switch';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import pluralize from 'pluralize';
import { ReactNode } from 'react';

import { Card } from '../../common/components/Card';
import { TokenPrice } from '../../common/types/tokenPrice';
import { numberToString } from '../../common/utils/utils';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import BitcoinIcon from '../../ui/icons/BitcoinIcon';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';
import { CurrentCycleCard } from './CurrentCycle';
import { SignersDistribution } from './SignerDistribution';
import { useStxSupply } from './data/usStxSupply';

function StatCardBase({
  statTitle,
  statValue,
  moreInfo,
}: {
  statTitle: string;
  statValue: string;
  moreInfo: string | ReactNode;
}) {
  return (
    <Card padding={6} height="100%">
      <Stack gap={3}>
        <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
          {statTitle}
        </Text>
        <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
          {statValue}
        </Text>
        {typeof moreInfo === 'string' ? (
          <Text fontSize="xs" fontWeight="medium" color="textSubdued" lineHeight={4}>
            {moreInfo}
          </Text>
        ) : (
          moreInfo
        )}
      </Stack>
    </Card>
  );
}

function StxStackedCard({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const { totalSupply, lockedSupply, unlockedSupply } = useStxSupply();
  const stxStakedUsd = tokenPrice.stxPrice * lockedSupply;
  const stxStakedUsdFormatted = `$${Math.round(stxStakedUsd).toLocaleString()}`;
  const stxStakedBtc = stxStakedUsd / tokenPrice.btcPrice;
  const stxStakedBtcFormatted = `${stxStakedBtc.toFixed(1)} BTC`;
  const moreInfo = `${stxStakedUsdFormatted} / ${stxStakedBtcFormatted}`;
  console.log('StxStackedCard', {
    totalSupply,
    lockedSupply,
    unlockedSupply,
    tokenPrice,
    stxStakedUsd,
    stxStakedUsdFormatted,
    stxStakedBtc,
    stxStakedBtcFormatted,
    moreInfo,
  });

  return (
    <StatCardBase
      statTitle="STX stacked"
      statValue={numberToString(lockedSupply)}
      moreInfo={
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="textSubdued"
          whiteSpace="nowrap"
          lineHeight={4}
        >
          {moreInfo}
        </Text>
      }
    />
  );
}

function StxLockedCard() {
  const { totalSupply, lockedSupply, unlockedSupply } = useStxSupply();

  const stxLockedPercentageFormatted = `${((lockedSupply / totalSupply) * 100).toFixed(1)}%`;
  console.log('StxLockedCard', {
    isUnlockedStxGreaterThanTotalStx: unlockedSupply > totalSupply,
    stxStaked: lockedSupply,
    stxLockedPercentageFormatted,
  });
  return (
    <StatCardBase
      statTitle="Total stacked"
      statValue={stxLockedPercentageFormatted}
      moreInfo={`of ${numberToString(totalSupply)} circulating supply`}
    />
  );
}

function AddressesStackingCard() {
  const randomStat = Math.floor(Math.random() * 201) - 100; // Random number between -100 and 100 TODO: replace with actual data
  const randomStatFormatted = `${Math.abs(randomStat)}%`;
  const icon = randomStat > 0 ? ArrowUpRight : ArrowDownRight;
  const modifier = randomStat > 0 ? 'more' : 'less';
  console.log('AddressesStackingCard - this data is unavailable atm and is randomly generated');

  const moreInfo = (
    <Text lineHeight={4} fontSize="xs" fontWeight="medium" color="textSubdued">
      <Text display="inline" whiteSpace="nowrap">
        <Icon as={icon} size={3} color={randomStat > 0 ? 'green.600' : 'red.600'} />
        &nbsp;{`${randomStatFormatted}`}&nbsp;
      </Text>
      <Text display="inline">{`${modifier} than previous cycle`}</Text>
    </Text>
  );

  return <StatCardBase statTitle="Addresses stacking" statValue={'2,443'} moreInfo={moreInfo} />;
}

function NextCycleCard() {
  const {
    currentRewardCycleId,
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
      statValue={currentRewardCycleId.toString()}
      moreInfo={moreInfo}
    />
  );
}

export function SignersHeaderLayout({
  stackingTitle,
  signerTitle,
  currentCycleCard,
  stxStakedCard,
  stxLockedCard,
  addressesStackingCard,
  nextCycleCard,
}: {
  stackingTitle: ReactNode;
  signerTitle: ReactNode;
  currentCycleCard: ReactNode;
  stxStakedCard: ReactNode;
  stxLockedCard: ReactNode;
  addressesStackingCard: ReactNode;
  nextCycleCard: ReactNode;
  historicalStackingDataLink: ReactNode;
}) {
  return (
    <Card width="full" flexDirection="column" padding={7} gap={4}>
      <Box
        display="grid"
        gridTemplateColumns={['100%', '100%', '100%', 'repeat(2, 1fr)', 'repeat(2, 1fr)']}
        gap={4}
        className="stipido"
      >
        <Stack width="full" gap={4}>
          <Flex
            direction={['column', 'column', 'row', 'row', 'row']}
            justifyContent="space-between"
            gap={4}
          >
            <Text fontSize="xs" fontWeight="semibold">
              {signerTitle}
            </Text>
            <FormControl display="flex" alignItems="center" gap={3} width="fit-content">
              <Switch id="show-public-signers" />
              <FormLabel
                htmlFor="show-public-signers"
                mb="0"
                fontSize={'14px'}
                lineHeight={'1.5em'}
                fontWeight={400}
                textOverflow={'ellipsis'}
                overflow={'hidden'}
                whiteSpace={'nowrap'}
              >
                Show only public signers
              </FormLabel>
            </FormControl>
          </Flex>
          <SignersDistribution />
        </Stack>
        <Stack width="full" gap={4}>
          <Text fontSize="xs" fontWeight="semibold">
            {stackingTitle}
          </Text>
          <Box
            display={['grid', 'grid', 'none', 'grid', 'grid']}
            gridTemplateColumns="50% 50%"
            width="100%"
            gap={4}
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
      </Box>

      {/* {historicalStackingDataLink} TODO: Add back when the stacking page is done */}
    </Card>
  );
}

export function SignersHeader({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <SignersHeaderLayout
      stackingTitle="STACKING"
      signerTitle="SIGNER DISTRIBUTION"
      currentCycleCard={<CurrentCycleCard />}
      stxStakedCard={<StxStackedCard tokenPrice={tokenPrice} />}
      stxLockedCard={<StxLockedCard />}
      addressesStackingCard={<AddressesStackingCard />}
      nextCycleCard={<NextCycleCard />}
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

export function SignersHeaderWithErrorBoundary({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <SignersHeader tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
