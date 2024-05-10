import { Box } from '@/ui/Box';
import { Flex } from '@/ui/Flex';
import { Grid } from '@/ui/Grid';
import { Stack } from '@/ui/Stack';
import { Text } from '@/ui/Text';
import { useColorMode } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, SectorProps } from 'recharts';

import { Card } from '../../common/components/Card';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignerInfo, useSuspensePoxSigners } from './data/useSigners';
import { getSignerKeyName } from './utils';

function getSignerDistributionPieChartColor(votingPowerPercentage: number) {
  if (votingPowerPercentage > 0 && votingPowerPercentage < 2) {
    return 'var(--stacks-colors-purple-200)';
  } else if (votingPowerPercentage >= 2 && votingPowerPercentage < 5) {
    return 'var(--stacks-colors-purple-300)';
  } else if (votingPowerPercentage >= 5 && votingPowerPercentage < 10) {
    return 'var(--stacks-colors-purple-400)';
  } else if (votingPowerPercentage >= 10 && votingPowerPercentage < 15) {
    return 'var(--stacks-colors-purple-500)';
  } else if (votingPowerPercentage >= 15 && votingPowerPercentage < 20) {
    return 'var(--stacks-colors-purple-600)';
  } else if (votingPowerPercentage >= 20 && votingPowerPercentage < 25) {
    return 'var(--stacks-colors-purple-700)';
  }
}

function getSignerDistributionPieChartStrokeWidth(votingPowerPercentage: number) {
  if (votingPowerPercentage > 0 && votingPowerPercentage < 2) {
    return 0.5;
  } else if (votingPowerPercentage >= 2 && votingPowerPercentage < 5) {
    return 1;
  } else if (votingPowerPercentage >= 5 && votingPowerPercentage < 10) {
    return 1.5;
  } else if (votingPowerPercentage >= 10 && votingPowerPercentage < 15) {
    return 2;
  } else if (votingPowerPercentage >= 15 && votingPowerPercentage < 20) {
    return 2.5;
  } else if (votingPowerPercentage >= 20 && votingPowerPercentage < 25) {
    return 3;
  }
}

function SignersDistributionLegend({ signers }: { signers: SignerInfo[] }) {
  // TODO: Probably need to add an ellipsis to the text
  return (
    <Stack gap={2}>
      {signers.map(signer => (
        <Flex justifyContent="space-between" key={signer.signing_key}>
          <Flex direction="row" gap={2} alignItems="center">
            <Box borderRadius="50%" fill={'something'} />
            <Text fontSize="sm">{getSignerKeyName(signer.signing_key)}</Text>
          </Flex>
          <Text fontSize="sm" fontWeight="semibold">
            {signer.weight_percent.toFixed(2)}%
          </Text>
        </Flex>
      ))}
    </Stack>
  );
}

// TODO: split out
export function SignersDistributionPieChart({ signers }: { signers: SignerInfo[] }) {
  const pieData = useMemo(
    () =>
      signers.map(signer => ({
        name: getSignerKeyName(signer.signing_key),
        value: signer.weight_percent,
      })),
    [signers]
  );
  console.log({ pieData });

  const pieChartWidth = 200;
  const pieChartHeight = 200;

  const [gradientId] = useState(`colorUv-${Math.random()}`);
  const colorMode = useColorMode().colorMode;

  const renderActiveShape = useCallback((props: SectorProps) => {
    const { cx, cy, innerRadius, outerRadius = 0, startAngle, endAngle, fill } = props;

    return (
      <>
        {/* Background sector for 'cycle_remaining' to visually merge the segments */}
        {/* <Sector
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
            /> */}
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
  }, []);

  const pieChart = useMemo(
    () => (
      // <Box
      //   width={pieChartWidth}
      //   height={pieChartHeight}
      //   minWidth={pieChartWidth}
      //   minHeight={pieChartHeight}
      // >
      <ResponsiveContainer width={pieChartWidth} height={pieChartHeight}>
        <PieChart width={pieChartWidth} height={pieChartHeight}>
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
            // activeIndex={1} // Index of the segment you want to be rounded
            activeShape={renderActiveShape}
          >
            {pieData.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={getSignerDistributionPieChartColor(entry.value)}
                  stroke={getSignerDistributionPieChartColor(entry.value)} // Ensure there's no stroke applied, or set it to match the background color
                  strokeWidth={getSignerDistributionPieChartStrokeWidth(entry.value)}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      // </Box>
    ),
    [pieData, renderActiveShape]
  );

  return pieChart;
}

export function SignersDistribution() {
  const { currentCycleId } = useSuspenseCurrentStackingCycle();
  const {
    data: { results: signers },
  } = useSuspensePoxSigners(currentCycleId);

  const pieData = useMemo(
    () =>
      signers.map(signer => ({
        name: getSignerKeyName(signer.signing_key),
        value: signer.weight_percent,
      })),
    [signers]
  );
  console.log({ pieData });

  return (
    <Card padding={6} height="100%">
      <Flex justifyContent="center" alignItems="center">
        <Grid templateColumns={['100%', '100%', '50% 50%', '100%', '100%']}>
          <SignersDistributionPieChart signers={signers} />
          <Box display={['block', 'block', 'block', 'none', 'none']}>
            <SignersDistributionLegend signers={signers} />
          </Box>
        </Grid>
      </Flex>
    </Card>
  );
}
