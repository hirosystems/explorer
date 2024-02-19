import { PiArrowRightLight } from 'react-icons/pi';
import { Cell, Pie, PieChart, Sector } from 'recharts';

import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Link } from '../../ui/Link';
import { Stack } from '../../ui/Stack';
import { Text } from '../../ui/Text';
import { Title } from '../../ui/typography';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';

function CurrentCycleCard() {
  const currentCyleProgressPercentage = 57.8;
  const pieData = [
    {
      name: 'cycle_remaining',
      value: 100 - currentCyleProgressPercentage,
    },
    {
      name: 'cycle_progress',
      value: currentCyleProgressPercentage,
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
          fill="#E0E1E6" // The 'cycle_remaining' color
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
            id="colorUv"
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
                fill={entry.name === 'cycle_remaining' ? '#E0E1E6' : 'url(#colorUv)'}
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
    <Card padding={6}>
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
              77
            </Text>
            <Text
              fontSize="md"
              fontWeight="14px"
              whiteSpace="nowrap"
              display="inline-block"
              color="secondaryText"
            >
              {`(${currentCyleProgressPercentage}%)`}
            </Text>
          </Box>
        </Stack>
      </Flex>
      <Text fontSize={'xs'} whiteSpace="nowrap" fontWeight="medium" color="secondaryText">
        Started ~12 days ago / Ends in ~7 days
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
  moreInfo: string;
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
        <Text fontSize="xs" fontWeight="medium" color="secondaryText">
          {moreInfo}
        </Text>
      </Stack>
    </Card>
  );
}

function StxStakedCard() {
  return <StatCardBase statTitle="STX Staked" statValue="234.23M" moreInfo="$431,425 / 12.3 BTC" />;
}

function StxLockedCard() {
  return (
    <StatCardBase statTitle="Locked" statValue="65.3%" moreInfo="/ 1.44B circulating supply" />
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
  return (
    <StatCardBase statTitle="Next cycle" statValue="78" moreInfo="Starts in ~8 days at #889300" />
  );
}

export function Signers() {
  return (
    <Card width="full" flexDirection="column" padding={7}>
      <Flex justifyContent="space-between" width="full" mb={4}>
        <Text fontSize='xs' fontWeight='semibold'>STACKING</Text>
        <Flex alignItems="center">
          <Link href="/" color="secondaryText" fontSize="xs" mr={1}>
            See Stacking historical data
          </Link>
          <Icon as={PiArrowRightLight} size={'12px'} color="secondaryText" />
        </Flex>
      </Flex>
      <Flex flexWrap="wrap">
        <Box display="grid" gridTemplateColumns="repeat(5, auto)" gap={4}>
          <CurrentCycleCard />
          <StxStakedCard />
          <StxLockedCard />
          <AddressesStackingCard />
          <NextCycleCard />
        </Box>
      </Flex>
    </Card>
  );
}

export function SignersWithErrorBoundary() {
  return (
    <ExplorerErrorBoundary renderContent={() => null}>
      <Signers />
    </ExplorerErrorBoundary>
  );
}
