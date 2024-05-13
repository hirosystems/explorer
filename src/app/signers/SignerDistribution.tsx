import { ColorMode, useBreakpointValue, useColorMode } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, TooltipProps } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { Card } from '../../common/components/Card';
import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Grid } from '../../ui/Grid';
import { Stack } from '../../ui/Stack';
import { Text, TextProps } from '../../ui/Text';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignerInfo, useSuspensePoxSigners } from './data/useSigners';
import { getSignerKeyName } from './utils';

function getShrinkFactor(value: number) {
  if (value < 2) {
    return 6;
  } else if (value >= 2 && value < 5) {
    return 5;
  } else if (value >= 5 && value < 10) {
    return 4;
  } else if (value >= 10 && value < 15) {
    return 3;
  } else if (value >= 15 && value < 20) {
    return 2;
  } else if (value >= 20 && value < 25) {
    return 1;
  } else return 0;
}

function getSignerDistributionPieChartColor(votingPowerPercentage: number, colorMode: ColorMode) {
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
  } else {
    return colorMode === 'light'
      ? 'var(--stacks-colors-slate-250)'
      : 'var(--stacks-colors-slate-800)';
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
function SignerLegendItem({
  signerName,
  signerVotingPower,
  ...rest
}: {
  signerName: string;
  signerVotingPower: number;
} & TextProps) {
  return (
    <Flex justifyContent="space-between" gap={2}>
      <Flex direction="row" gap={2} alignItems="center">
        <Box
          height={2}
          width={2}
          borderRadius="50%"
          backgroundColor={getSignerDistributionPieChartColor(signerVotingPower, 'light')}
        />
        <Text fontSize="sm" {...rest}>
          {signerName}
        </Text>
      </Flex>
      <Text fontSize="sm" fontWeight="semibold" {...rest}>
        {signerVotingPower.toFixed(2)}%
      </Text>
    </Flex>
  );
}

function SignersDistributionLegend({
  signers,
  onlyShowPublicSigners,
}: {
  signers: SignerInfo[];
  onlyShowPublicSigners: boolean;
}) {
  const knownSigners = useMemo(
    () =>
      signers
        .filter(signer => getSignerKeyName(signer.signing_key) !== 'unknown')
        .map(signer => ({
          value: signer.weight_percent,
          name: getSignerKeyName(signer.signing_key),
        })),
    [signers]
  );
  const unknownSigners = useMemo(
    () =>
      signers
        .filter(signer => getSignerKeyName(signer.signing_key) === 'unknown')
        .reduce((acc, signer) => acc + signer.weight_percent, 0),
    [signers]
  );

  const filiteredSigners = onlyShowPublicSigners
    ? knownSigners
    : knownSigners.concat({ name: 'Private signers', value: unknownSigners });

  return (
    <Stack gap={2}>
      {filiteredSigners.map(signer => (
        <SignerLegendItem
          key={signer.name}
          signerName={signer.name}
          signerVotingPower={signer.value}
        />
      ))}
    </Stack>
  );
}

const startAngle = 120;
const endAngle = -(360 - startAngle);

export function SignersDistributionPieChart({
  signers,
  onlyShowPublicSigners,
}: {
  signers: SignerInfo[];
  onlyShowPublicSigners: boolean;
}) {
  const pieData = useMemo(() => {
    const knownSignersWithPercentageGreaterThan2 = signers
      .filter(
        signer => getSignerKeyName(signer.signing_key) !== 'unknown' && signer.weight_percent > 1
      )
      .map(signer => ({
        name: getSignerKeyName(signer.signing_key),
        value: signer.weight_percent,
      }));
    const knownSignersWithPercentageLessThan2 = signers
      .filter(
        signer => getSignerKeyName(signer.signing_key) !== 'unknown' && signer.weight_percent <= 1
      )
      .reduce((acc, signer) => acc + signer.weight_percent, 0);
    const unknownSignersPercentage = signers
      .filter(signer => getSignerKeyName(signer.signing_key) === 'unknown')
      .reduce((acc, signer) => acc + signer.weight_percent, 0);
    return onlyShowPublicSigners
      ? knownSignersWithPercentageGreaterThan2.concat({
          name: 'Others',
          value: knownSignersWithPercentageLessThan2,
        })
      : knownSignersWithPercentageGreaterThan2
          .concat({
            name: 'Others',
            value: knownSignersWithPercentageLessThan2,
          })
          .concat({
            name: 'Private signers',
            value: unknownSignersPercentage,
          });
  }, [signers, onlyShowPublicSigners]);
  const colorMode = useColorMode().colorMode;

  const showLabels = useBreakpointValue({ sm: false, md: false, lg: true, xl: true, '2xl': true });

  const renderActiveShape = useCallback(
    ({
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle,
      endAngle,
      fill,
      value = 0,
      name,
      midAngle = 0,
    }: PieSectorDataItem) => {
      // Calculate dynamic radii based on the value
      const smallestWidth = (outerRadius - innerRadius) / 1.5;
      const shrinkableWidth = outerRadius - innerRadius - smallestWidth;
      const shrinkFactor = shrinkableWidth / 7; // 7 is the number of ranges we have made
      const shrinkMultiple = getShrinkFactor(value);
      const shrinkValue = shrinkFactor * shrinkMultiple;
      const dynamicInnerRadius = innerRadius + shrinkValue;
      const dynamicOuterRadius = outerRadius - shrinkValue;

      const RADIAN = Math.PI / 180;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (dynamicOuterRadius + 10) * cos;
      const sy = cy + (dynamicOuterRadius + 10) * sin;
      const mx = cx + (dynamicOuterRadius + 30) * cos;
      const my = cy + (dynamicOuterRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';

      return (
        <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={dynamicInnerRadius}
            outerRadius={dynamicOuterRadius}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            strokeWidth={1}
          />
          {showLabels ? (
            <>
              <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke="var(--stacks-colors-borderPrimary)"
                fill="none"
              />
              <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="var(--stacks-colors-textSubdued)"
                fontSize="var(--stacks-fontSizes-xs)"
              >
                {name}
              </text>
            </>
          ) : null}
        </g>
      );
    },
    [showLabels]
  );

  const CustomTooltip = useCallback(
    ({ active, payload }: TooltipProps<any, any>) => {
      if (active && payload && payload.length) {
        return (
          <Box
            backgroundColor={colorMode === 'light' ? 'slate.900' : 'slate.850'}
            borderRadius="md"
            paddingX={2.5}
            paddingY={2}
          >
            <SignerLegendItem
              signerName={payload[0].name}
              signerVotingPower={payload[0].value}
              color="slate.50"
            />
          </Box>
        );
      }

      return null;
    },
    [colorMode]
  );

  const activeIndices = useMemo(
    () => Array.from({ length: pieData.length }, (_, i) => i),
    [pieData]
  );

  const pieChart = useMemo(
    () => (
      <ResponsiveContainer className="responsive-container">
        <PieChart>
          <Pie
            paddingAngle={1}
            startAngle={startAngle}
            endAngle={endAngle}
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            label={false}
            innerRadius={40}
            outerRadius={80}
            activeIndex={activeIndices} // Set all indices to active so they can be custom rendered
            activeShape={renderActiveShape}
          >
            {pieData.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={getSignerDistributionPieChartColor(entry.value, colorMode)}
                  strokeWidth={getSignerDistributionPieChartStrokeWidth(entry.value)}
                />
              );
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    ),
    [pieData, renderActiveShape, activeIndices, colorMode, CustomTooltip]
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

  return (
    <Card padding={6} height="100%" className="card">
      <Flex className="flex" height="100%" width="100%" justifyContent="center" alignItems="center">
        <Grid
          className="grid"
          height="100%"
          width="100%"
          templateColumns={['100%', '100%', '50% 50%', '100%', '100%']}
        >
          <Flex justifyContent="center" alignItems="center" height="100%" width="100%">
            <Box height="350px" width="100%">
              <SignersDistributionPieChart
                signers={signers}
                onlyShowPublicSigners={onlyShowPublicSigners}
              />
            </Box>
          </Flex>
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
