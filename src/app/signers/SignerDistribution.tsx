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

function SignersDistributionLegend({
  signers,
  onlyShowPublicSigners,
}: {
  signers: SignerInfo[];
  onlyShowPublicSigners: boolean;
}) {
  const filiteredSigners = onlyShowPublicSigners
    ? signers.filter(signer => getSignerKeyName(signer.signing_key) !== 'unknown')
    : signers;

  // TODO: Probably need to add an ellipsis to the text
  return (
    <Stack gap={2}>
      {filiteredSigners.map(signer => (
        <Flex justifyContent="space-between" key={signer.signing_key}>
          <Flex direction="row" gap={2} alignItems="center">
            <Box
              height={2}
              width={2}
              borderRadius="50%"
              backgroundColor={getSignerDistributionPieChartColor(signer.weight_percent)}
            />
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
  const baseInnerRadius = 40;
  const baseOuterRadius = 80;
  const scaleFactor = 0.1; // Adjust based on your requirements

  const pieData = useMemo(
    () =>
      signers.map(signer => ({
        name: getSignerKeyName(signer.signing_key),
        value: signer.weight_percent,
        innerRadius: baseInnerRadius + signer.weight_percent * scaleFactor,
        outerRadius: baseOuterRadius + signer.weight_percent * scaleFactor,
      })),

    [signers]
  );

  const pieChartWidth = 200;
  const pieChartHeight = 200;

  const [gradientId] = useState(`colorUv-${Math.random()}`);
  const colorMode = useColorMode().colorMode;

  const renderActiveShape = useCallback((props: SectorProps) => {
    const { cx, cy, innerRadius, outerRadius = 0, startAngle, endAngle, fill, value, name } = props;

    // Define a base size and a scale factor
    const baseSize = 10; // Base increment size
    const scaleFactor = 0.1; // Adjust this factor to increase or decrease the impact of the value on size

    // Calculate dynamic radii based on the value
    const increment = value * scaleFactor;
    const dynamicInnerRadius = innerRadius + increment;
    const dynamicOuterRadius = outerRadius + increment;
    console.log({ name, value, increment, dynamicInnerRadius, dynamicOuterRadius });

    return (
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        // outerRadius={outerRadius}
        outerRadius={dynamicOuterRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={outerRadius / 5}
        strokeWidth={0.5}
        stroke={fill}
      />
    );
  }, []);

  const activeIndex = 0; // Constant index for all segments

  const pieChart = useMemo(
    () => (
      // <Box
      //   width={pieChartWidth}
      //   height={pieChartHeight}
      //   minWidth={pieChartWidth}
      //   minHeight={pieChartHeight}
      // >
      <ResponsiveContainer
        width={pieChartWidth}
        height={pieChartHeight}
        // width="75%"
        // height="75%"
      >
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
            // innerRadius={40}
            // outerRadius={80}
            activeIndex={activeIndex} // Index of the segment you want to be rounded
            activeShape={renderActiveShape}
            // content={<CustomSector />}

            // innerRadius={data => data.innerRadius}
            // outerRadius={data => data.outerRadius}
          >
            {pieData.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={getSignerDistributionPieChartColor(entry.value)}
                  // stroke={getSignerDistributionPieChartColor(entry.value)} // Ensure there's no stroke applied, or set it to match the background color
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

export function SignersDistribution({
  onlyShowPublicSigners = false, // TODO: change to true
}: {
  onlyShowPublicSigners?: boolean;
}) {
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

  return (
    <Card padding={6} height="100%">
      <Flex height="100%" justifyContent="center" alignItems="center">
        <Grid templateColumns={['100%', '100%', '50% 50%', '100%', '100%']}>
          <SignersDistributionPieChart signers={signers} />
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
