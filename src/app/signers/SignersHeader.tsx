import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { UseQueryResult, useQueries, useQueryClient } from '@tanstack/react-query';
import pluralize from 'pluralize';
import { ReactNode, useMemo, useState } from 'react';

import { Card } from '../../common/components/Card';
import { ApiResponseWithResultsOffset } from '../../common/types/api';
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
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';
import { CurrentCycleCard } from './CurrentCycle';
import { SignerDistributionHeader, SignersDistribution } from './SignerDistribution';
import { SignersStackersData, useGetStackersBySignerQuery } from './data/UseSignerAddresses';
import { useStxSupply } from './data/usStxSupply';
import { useSuspensePoxSigners } from './data/useSigners';

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
  const { stackedSupply } = useStxSupply();
  const stackedStxUsdValue =
    tokenPrice.stxPrice != null ? tokenPrice.stxPrice * stackedSupply : undefined;
  const stackedStxUsdValueFormatted = stackedStxUsdValue
    ? `$${Math.round(stackedStxUsdValue).toLocaleString()}`
    : undefined;
  const stackedStxBtcValue =
    stackedStxUsdValue && tokenPrice.btcPrice != null && tokenPrice.btcPrice !== 0
      ? stackedStxUsdValue / tokenPrice.btcPrice
      : undefined;
  const stackedStxBtcValueFormatted = stackedStxBtcValue
    ? `${stackedStxBtcValue.toFixed(1)} BTC`
    : undefined;
  const moreInfo =
    stackedStxUsdValueFormatted && stackedStxBtcValueFormatted
      ? `${stackedStxUsdValueFormatted} / ${stackedStxBtcValueFormatted}`
      : undefined;

  return (
    <StatCardBase
      statTitle="STX stacked"
      statValue={numberToString(stackedSupply)}
      moreInfo={
        moreInfo ? (
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="textSubdued"
            whiteSpace="nowrap"
            lineHeight={4}
          >
            {moreInfo}
          </Text>
        ) : null
      }
    />
  );
}

function TotalStackedCard() {
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

function AddressesStackingCard() {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const previousCycleId = useMemo(() => currentCycleId - 1, [currentCycleId]);

  const {
    data: { results: currentCycleSigners },
  } = useSuspensePoxSigners(currentCycleId);
  const {
    data: { results: previousCycleSigners },
  } = useSuspensePoxSigners(previousCycleId);

  const queryClient = useQueryClient();
  const getQuery = useGetStackersBySignerQuery();
  const currentCycleSignersStackersQueries = useMemo(() => {
    return {
      queries: currentCycleSigners.map(signer => {
        return getQuery(currentCycleId, signer.signing_key);
      }),
      combine: (
        response: UseQueryResult<ApiResponseWithResultsOffset<SignersStackersData>, Error>[]
      ) => response.map(r => r.data?.results ?? []),
    };
  }, [currentCycleSigners, getQuery, currentCycleId]);
  const previousCycleSignersStackersQueries = useMemo(() => {
    return {
      queries: previousCycleSigners
        ? previousCycleSigners.map(signer => {
            return getQuery(previousCycleId, signer.signing_key);
          })
        : [],
      combine: (
        response: UseQueryResult<ApiResponseWithResultsOffset<SignersStackersData>, Error>[]
      ) => response.map(r => r.data?.results ?? []),
    };
  }, [previousCycleSigners, getQuery, previousCycleId]);

  const currentCycleSignersStackers = useQueries(currentCycleSignersStackersQueries, queryClient);
  const previousCycleSignersStackers = useQueries(previousCycleSignersStackersQueries, queryClient);

  const numCurrentCycleStackers = currentCycleSignersStackers.length;
  const numPreviousCycleStackers = previousCycleSignersStackers.length;

  const rate = numPreviousCycleStackers
    ? (numCurrentCycleStackers - numPreviousCycleStackers) / numPreviousCycleStackers
    : undefined;

  const moreInfo = rate ? (
    <Text lineHeight={4} fontSize="xs" fontWeight="medium" color="textSubdued">
      <Text display="inline" whiteSpace="nowrap">
        <Icon
          as={rate > 0 ? ArrowUpRight : ArrowDownRight}
          size={3}
          color={rate > 0 ? 'green.600' : 'red.600'}
        />
        &nbsp;{`${rate * 100}%`}&nbsp;
      </Text>
      <Text display="inline">{`${rate > 0 ? 'more' : 'less'} than previous cycle`}</Text>
    </Text>
  ) : null;

  return (
    <StatCardBase
      statTitle="Addresses stacking"
      statValue={numCurrentCycleStackers.toString()}
      moreInfo={moreInfo}
    />
  );
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

export function SignersHeaderWithErrorBoundary({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <SignersHeader tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
