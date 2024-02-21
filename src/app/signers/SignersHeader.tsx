import { TokenPrice } from '@/common/types/tokenPrice';
import { ColorMode, useColorMode } from '@chakra-ui/react';
import { ReactNode, useState } from 'react';
import { PiArrowRightLight } from 'react-icons/pi';
import { Cell, Pie, PieChart, Sector } from 'recharts';

import { Card } from '../../common/components/Card';
import { useSuspenseStxSupply } from '../../common/queries/useStxSupply';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { BitcoinIcon } from '../../ui/icons/BitcoinIcon';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { useSuspenseNextStackingCycle } from '../_components/Stats/NextStackingCycle/useNextStackingCycle';

function CurrentCycleCard({ colorMode }: { colorMode: ColorMode }) {
  const {
    currentCycleId,
    currentCycleProgressPercentage,
    approximateDaysSinceCurrentCycleStart,
    approximateDaysTilNextCycle,
  } = useSuspenseCurrentStackingCycle();
  const [gradientId] = useState(`colorUv-${Math.random()}`);

  const pieData = [
    {
      name: 'cycle_remaining',
      value: Number.parseFloat((1 - currentCycleProgressPercentage).toFixed(1)),
    },
    {
      name: 'cycle_progress',
      value: Number.parseFloat(currentCycleProgressPercentage.toFixed(1)),
    },
  ];
  const pieChartWidth = 50;
  const pieChartHeight = 50;

  // Customized active shape with rounded edges
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <>
        {/* Background sector for 'cycle_remaining' to visually merge the segments */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={0} // Start from the top of the circle
          endAngle={360} // Full circle
          fill={
            colorMode === 'light'
              ? 'var(--stacks-colors-slate-250)'
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
          cornerRadius={outerRadius / 5} // Adjust for desired roundness
        />
      </>
    );
  };

  const piechart = (
    <Box
      width={pieChartWidth}
      height={pieChartHeight}
      minWidth={pieChartWidth}
      minHeight={pieChartHeight}
    >
      <PieChart width={pieChartWidth} height={pieChartHeight}>
        <defs>
          <linearGradient
            id={gradientId}
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
                fill={entry.name === 'cycle_remaining' ? '#E0E1E6' : `url(#${gradientId})`}
                stroke="none"
                strokeWidth={0}
              />
            );
          })}
        </Pie>
      </PieChart>
    </Box>
  );

  return (
    <Card padding={6} height="100%">
      <Flex mb={3}>
        <Box mr="16px">{piechart}</Box>
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
              color="secondaryText"
            >
              {`(${(currentCycleProgressPercentage * 100).toFixed(1)}%)`}
            </Text>
          </Box>
        </Stack>
      </Flex>
      <Text fontSize={'xs'} whiteSpace="nowrap" fontWeight="medium" color="secondaryText">
        {`Started ~${approximateDaysSinceCurrentCycleStart} days ago / Ends in ~${approximateDaysTilNextCycle} days`}
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
          <Text fontSize="xs" fontWeight="medium" color="secondaryText">
            {moreInfo}
          </Text>
        ) : (
          moreInfo
        )}
      </Stack>
    </Card>
  );
}

function StxStakedCard({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const {
    data: { total_stx, unlocked_stx },
  } = useSuspenseStxSupply();
  const stxStakedFormatted = `${(
    (Number.parseInt(total_stx) - Number.parseInt(unlocked_stx)) /
    1_000_000
  ).toFixed(2)}M`;
  const stxStakedUsd =
    tokenPrice.stxPrice * (Number.parseInt(total_stx) - Number.parseInt(unlocked_stx));
  const stxStakedUsdFormatted = `$${Math.round(stxStakedUsd).toLocaleString()}`;
  const stxStakedBtc = stxStakedUsd / tokenPrice.btcPrice;
  const stxStakedBtcFormatted = `${stxStakedBtc.toFixed(1)} BTC`;
  const moreInfo = `${stxStakedUsdFormatted} / ${stxStakedBtcFormatted}`;

  return <StatCardBase statTitle="STX Staked" statValue={stxStakedFormatted} moreInfo={moreInfo} />;
}

function StxLockedCard() {
  const {
    data: { total_stx, unlocked_stx },
  } = useSuspenseStxSupply();
  const stxLockedPercentageFormatted = `${(
    ((Number.parseInt(total_stx) - Number.parseInt(unlocked_stx)) / Number.parseInt(total_stx)) *
    100
  ).toFixed(1)}%`;
  const stxCirculatingSupplyInBillions = `${(Number.parseInt(unlocked_stx) / 1_000_000_000).toFixed(
    2
  )}B`;
  return (
    <StatCardBase
      statTitle="Locked"
      statValue={stxLockedPercentageFormatted}
      moreInfo={`/ ${stxCirculatingSupplyInBillions} circulating supply`}
    />
  );
}

function AddressesStackingCard() {
  return (
    <StatCardBase
      statTitle="Addresses Stacking"
      statValue="2,443"
      moreInfo="↗︎23,4% more than previous cycle"
    />
  );
}

function NextCycleCard() {
  const {
    currenrRewardCycleId,
    nextCycleBurnBlockHeightStart,
    displayPreparePhaseInfo,
    approximateDaysTilNextCyclePreparePhase,
    approximateDaysTilNextCycleRewardPhase,
  } = useSuspenseNextStackingCycle();

  const moreInfo = (
    <Flex gap={1} alignItems='center'>
      <Text fontSize="xs" fontWeight="medium" color="secondaryText">
        {`Starts in ~${
          displayPreparePhaseInfo
            ? approximateDaysTilNextCyclePreparePhase
            : approximateDaysTilNextCycleRewardPhase
        }
        at ${nextCycleBurnBlockHeightStart}`}
      </Text>
      <Icon as={BitcoinIcon} size={4.5} />
    </Flex>
  );

  return (
    <StatCardBase
      statTitle="Next cycle"
      statValue={currenrRewardCycleId.toString()}
      moreInfo={moreInfo}
    />
  );
}

export function SignersHeader({ tokenPrice }: { tokenPrice: TokenPrice }) {
  const colorModeContext = useColorMode();
  const colorMode = colorModeContext.colorMode;
  return (
    <Card width="full" flexDirection="column" padding={7} gap={4}>
      <Box width="full">
        <Text fontSize="xs" fontWeight="semibold">
          STACKING
        </Text>
      </Box>
      <Flex flexWrap="wrap" gap={4}>
        <Box display={['block', 'block', 'block', 'none']} width="100%">
          <CurrentCycleCard colorMode={colorMode} />
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={['50% 50%', '50% 50%', '50% 50%', 'repeat(5, 1fr)']}
          width="100%"
          gap={4}
        >
          <Box display={['none', 'none', 'none', 'block']}>
            <CurrentCycleCard colorMode={colorMode} />
          </Box>
          <StxStakedCard tokenPrice={tokenPrice} />
          <StxLockedCard />
          <AddressesStackingCard />
          <NextCycleCard />
        </Box>
      </Flex>
      <Flex alignItems="center">
        <Link href="/" color="secondaryText" fontSize="xs" mr={1}>
          See Stacking historical data
        </Link>
        <Icon as={PiArrowRightLight} size={'12px'} color="secondaryText" />
      </Flex>
    </Card>
  );
}

export function SignersHeaderWithErrorBoundary({ tokenPrice }: { tokenPrice: TokenPrice }) {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <SignersHeader tokenPrice={tokenPrice} />
    </ExplorerErrorBoundary>
  );
}
