import { useColorMode } from '@chakra-ui/react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import pluralize from 'pluralize';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, SectorProps } from 'recharts';

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
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';
import { useStxSupply } from './data/usStxSupply';

function CurrentCycleCard() {
  const {
    currentCycleId,
    currentCycleProgressPercentage,
    approximateDaysSinceCurrentCycleStart,
    approximateDaysTilNextCycle,
  } = useSuspenseCurrentStackingCycle();
  const colorMode = useColorMode().colorMode;
  const [gradientId] = useState(`colorUv-${Math.random()}`);

  const pieData = useMemo(
    () => [
      {
        name: 'cycle_remaining',
        value: Number.parseFloat((1 - currentCycleProgressPercentage).toFixed(1)),
      },
      {
        name: 'cycle_progress',
        value: Number.parseFloat(currentCycleProgressPercentage.toFixed(1)),
      },
    ],
    [currentCycleProgressPercentage]
  );

  const pieChartWidth = 50;
  const pieChartHeight = 50;

  const renderActiveShape = useCallback(
    (props: SectorProps) => {
      const { cx, cy, innerRadius, outerRadius = 0, startAngle, endAngle, fill } = props;

      return (
        <>
          {/* Background sector for 'cycle_remaining' to visually merge the segments */}
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={0}
            endAngle={360}
            fill={
              colorMode === 'light'
                ? 'var(--stacks-colors-purple-200)'
                : 'var(--stacks-colors-slate-850)'
            }
            strokeWidth={0.5}
            stroke={
              colorMode === 'light'
                ? 'var(--stacks-colors-purple-200)'
                : 'var(--stacks-colors-slate-850)'
            }
          />
          {/* Active 'cycle_progress' segment */}
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            cornerRadius={outerRadius / 5}
            strokeWidth={0.5}
            stroke={fill}
          />
        </>
      );
    },
    [colorMode]
  );

  const pieChart = useMemo(
    () => (
      <Box
        width={pieChartWidth}
        height={pieChartHeight}
        minWidth={pieChartWidth}
        minHeight={pieChartHeight}
      >
        <PieChart width={pieChartWidth} height={pieChartHeight}>
          <defs>
            <linearGradient
              id={`${gradientId}-light`} // def for pie chart progress gradient for light mode
              x1="28.1198"
              y1="27.8877"
              x2="8.60376"
              y2="37.4809"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5546FF" />
              <stop offset="1" stopColor="#5546FF" stopOpacity="0.37" />
            </linearGradient>
          </defs>
          <defs>
            <linearGradient
              id={`${gradientId}-dark`} // def for pie chart progress gradient for dark mode
              x1="21.7866"
              y1="25.8877"
              x2="2.27051"
              y2="35.4809"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5C6CF2" />
              <stop offset="1" stopColor="#7F97F1" />
            </linearGradient>
          </defs>
          <Pie
            paddingAngle={0}
            startAngle={90}
            endAngle={-270}
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            innerRadius={14}
            outerRadius={22}
            activeIndex={1} // Index of the segment you want to be rounded
            activeShape={renderActiveShape}
          >
            {pieData.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.name === 'cycle_remaining'
                      ? 'var(--stacks-colors-purple-200)'
                      : `url(#${`${gradientId}-${colorMode}`})`
                  }
                  stroke={
                    entry.name === 'cycle_remaining' && colorMode === 'light'
                      ? 'var(--stacks-colors-purple-200)'
                      : entry.name === 'cycle_remaining' && colorMode === 'dark'
                        ? 'var(--stacks-colors-slate-850)'
                        : ''
                  } // Ensure there's no stroke applied, or set it to match the background color
                  strokeWidth={0.5}
                />
              );
            })}
          </Pie>
        </PieChart>
      </Box>
    ),
    [colorMode, gradientId, pieData, renderActiveShape]
  );

  return (
    <Card padding={6} height="100%">
      <Flex mb={3}>
        <Box mr="16px">{pieChart}</Box>
        <Stack gap={3}>
          <Text fontSize={'xs'} fontWeight="medium" whiteSpace={'nowrap'}>
            Current cycle
          </Text>
          <Box whiteSpace="nowrap">
            <Text
              fontSize="xl"
              fontWeight="medium"
              whiteSpace="nowrap"
              display="inline-block"
              mr={1}
            >
              {currentCycleId}
            </Text>
            <Text
              fontSize="md"
              fontWeight="14px"
              whiteSpace="nowrap"
              display="inline-block"
              color="textSubdued"
            >
              {`(${(currentCycleProgressPercentage * 100).toFixed(1)}%)`}
            </Text>
          </Box>
        </Stack>
      </Flex>
      <Text fontSize={'xs'} whiteSpace="nowrap" fontWeight="medium" color="textSubdued">
        {`Started ~${approximateDaysSinceCurrentCycleStart} ${pluralize(
          'day',
          approximateDaysSinceCurrentCycleStart
        )} ago / Ends in ~${approximateDaysTilNextCycle} ${pluralize(
          'day',
          approximateDaysTilNextCycle
        )}`}
      </Text>
    </Card>
  );
}

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
    <Card padding={6}>
      <Stack gap={3}>
        <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
          {statTitle}
        </Text>
        <Text fontSize="xl" fontWeight="medium" whiteSpace="nowrap" display="inline-block" mr={1}>
          {statValue}
        </Text>
        {typeof moreInfo === 'string' ? (
          <Text fontSize="xs" fontWeight="medium" color="textSubdued">
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
  // const stxStakedInMillions = lockedSupply / 1_000_000;
  // const stxStakedFormatted = `${stxStakedInMillions.toFixed(2)}M`;
  const stxStakedUsd = tokenPrice.stxPrice * lockedSupply;
  const stxStakedUsdFormatted = `$${Math.round(stxStakedUsd).toLocaleString()}`;
  const stxStakedBtc = stxStakedUsd / tokenPrice.btcPrice;
  const stxStakedBtcFormatted = `${stxStakedBtc.toFixed(1)} BTC`;
  const moreInfo = `${stxStakedUsdFormatted} / ${stxStakedBtcFormatted}`;
  console.log('StxStackedCard', {
    totalSupply,
    lockedSupply,
    unlockedSupply,
    // stxStaked: stxStakedInMillions,
    tokenPrice,
    stxStakedUsd,
    stxStakedUsdFormatted,
    stxStakedBtc,
    stxStakedBtcFormatted,
    moreInfo,
  });

  return (
    <StatCardBase
      statTitle="STX Stacked"
      statValue={numberToString(lockedSupply)}
      moreInfo={
        <Text fontSize="xs" fontWeight="medium" color="textSubdued" whiteSpace="nowrap">
          {moreInfo}
        </Text>
      }
    />
  );
}

function StxLockedCard() {
  const { totalSupply, lockedSupply, unlockedSupply } = useStxSupply();

  const stxLockedPercentageFormatted = `${((lockedSupply / totalSupply) * 100).toFixed(1)}%`;
  // const stxCirculatingSupplyInBillions = numberToString(totalSupply) // `${(totalSupply / 1_000_000_000).toFixed(2)}B`;
  console.log('StxLockedCard', {
    isUnlockedStxGreaterThanTotalStx: unlockedSupply > totalSupply,
    stxStaked: lockedSupply,
    stxLockedPercentageFormatted,
    // stxCirculatingSupplyInBillions,
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
    <Flex gap={1} alignItems="flex-start" flexWrap="nowrap">
      <Icon as={icon} size={4} color={randomStat > 0 ? 'green.600' : 'red.600'} />
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
        {`${randomStatFormatted} ${modifier} than previous cycle`}
      </Text>
    </Flex>
  );

  return <StatCardBase statTitle="Addresses Stacking" statValue={'2,443'} moreInfo={moreInfo} />;
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
    <Flex gap={1} alignItems="flex-start">
      <Text fontSize="xs" fontWeight="medium" color="textSubdued">
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
        at`}{' '}
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="textSubdued"
          whiteSpace="nowrap"
          display="flex"
          alignItems="center"
        >
          <Icon as={BitcoinIcon} size={4.5} /> {`#${nextCycleBurnBlockHeightStart}`}
        </Text>
      </Text>
    </Flex>
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
  title,
  currentCycleCard,
  stxStakedCard,
  stxLockedCard,
  addressesStackingCard,
  nextCycleCard,
}: {
  title: ReactNode;
  currentCycleCard: ReactNode;
  stxStakedCard: ReactNode;
  stxLockedCard: ReactNode;
  addressesStackingCard: ReactNode;
  nextCycleCard: ReactNode;
  historicalStackingDataLink: ReactNode;
}) {
  return (
    <Card width="full" flexDirection="column" padding={7} gap={4}>
      <Box width="full">
        <Text fontSize="xs" fontWeight="semibold">
          {title}
        </Text>
      </Box>
      <Flex flexWrap="wrap" gap={4}>
        <Box display={['block', 'block', 'block', 'none']} width="100%">
          {currentCycleCard}
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={['50% 50%', '50% 50%', '50% 50%', 'repeat(5, 1fr)']}
          width="100%"
          gap={4}
        >
          <Box display={['none', 'none', 'none', 'block']}>{currentCycleCard}</Box>
          {stxStakedCard}
          {stxLockedCard}
          {addressesStackingCard}
          {nextCycleCard}
        </Box>
      </Flex>
      {/* {historicalStackingDataLink} TODO: Add back when the stacking page is done */}
    </Card>
  );
}

export function SignersHeader({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <SignersHeaderLayout
      title="STACKING"
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
