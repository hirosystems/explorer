import { Box, ClientOnly } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip, TooltipProps } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { getColorWithOpacity } from '../../common/utils/color-utils';
import { useColorMode } from '../../components/ui/color-mode';
import { system } from '../../ui/theme/theme';
import { SignerLegendItem } from './SignerDistributionLegend';
import { PoxSigner } from './data/useSigners';
import { PieChartSkeleton } from './skeleton';
import { getSignerKeyName } from './utils';

export function getSignerDistributionPieChartColor(
  isKnownSigner: boolean,
  votingPowerPercentage: number,
  theme: string
) {
  let color = '';
  if (!isKnownSigner) {
    color = theme === 'light' ? 'colors.slate.250' : 'colors.slate.800';
  } else if (votingPowerPercentage > 0 && votingPowerPercentage < 2) {
    color = 'colors.purple.200';
  } else if (votingPowerPercentage >= 2 && votingPowerPercentage < 5) {
    color = 'colors.purple.300';
  } else if (votingPowerPercentage >= 5 && votingPowerPercentage < 10) {
    color = 'colors.purple.400';
  } else if (votingPowerPercentage >= 10 && votingPowerPercentage < 15) {
    color = 'colors.purple.500';
  } else if (votingPowerPercentage >= 15 && votingPowerPercentage < 20) {
    color = 'colors.purple.600';
  } else if (votingPowerPercentage >= 20 && votingPowerPercentage < 25) {
    color = 'colors.purple.700';
  } else if (votingPowerPercentage >= 25) {
    color = 'colors.purple.800';
  }
  return system.token(color);
}

const startAngle = 0;
const endAngle = -(360 - startAngle);
const innerRadius = 70;
const outerRadius = 100;
const pieChartWidth = 220;
const pieChartHeight = 220;

interface PieData {
  name: string;
  value: number;
}

interface SignersDistributionPieChartProps {
  signers: PoxSigner[];
  onlyShowPublicSigners: boolean;
}

function renderActiveShape({
  cx = 0,
  cy = 0,
  innerRadius = 0,
  outerRadius = 0,
  startAngle,
  endAngle,
  fill,
}: PieSectorDataItem) {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        strokeWidth={1}
      />
    </g>
  );
}

const renderCenterCustomizedLabel = ({
  numSigners,
  cx,
  cy,
}: {
  numSigners: number;
  cx: number;
  cy: number;
}) => {
  const lineHeight = 20;

  return (
    <g>
      <text
        x={cx}
        y={cy - lineHeight / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: 'var(--stacks-colors-text-subdued)',
          fontSize: 'var(--stacks-font-sizes-sm)',
          fontWeight: 'var(--stacks-font-weights-sm)',
        }}
      >
        Total Signers
      </text>
      <text
        x={cx}
        y={cy + lineHeight}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fill: 'var(--stacks-colors-text)',
          fontSize: 'var(--stacks-font-sizes-2xl)',
          fontWeight: 'var(--stacks-font-weights-medium)',
        }}
      >
        {numSigners}
      </text>
    </g>
  );
};

export function SignersDistributionPieChart({
  signers,
  onlyShowPublicSigners,
}: SignersDistributionPieChartProps) {
  if (!signers) {
    throw new Error('Signers data is not available');
  }

  const { colorMode } = useColorMode();

  const pieData: PieData[] = useMemo(() => {
    const thresholdPercentage = 1;
    const knownSignersWithPercentageGreaterThanThreshold = signers
      .filter(
        signer =>
          getSignerKeyName(signer.signing_key) !== 'unknown' &&
          signer.weight_percent > thresholdPercentage
      )
      .map(signer => ({
        name: getSignerKeyName(signer.signing_key),
        value: signer.weight_percent,
      }))
      .sort((a, b) => a.value - b.value);
    const unknownSignersWithPercentageGreaterThanThreshold = signers
      .filter(
        signer =>
          getSignerKeyName(signer.signing_key) === 'unknown' &&
          signer.weight_percent > thresholdPercentage
      )
      .map(signer => ({
        name: 'Other signer',
        value: signer.weight_percent,
      }))
      .sort((a, b) => a.value - b.value);

    let signersData = knownSignersWithPercentageGreaterThanThreshold;

    if (!onlyShowPublicSigners) {
      signersData = signersData.concat(unknownSignersWithPercentageGreaterThanThreshold);
    }

    return signersData;
  }, [signers, onlyShowPublicSigners]);

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
              isKnownSigner={payload[0].name !== 'Other signer'}
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

  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const pieChart = useMemo(
    () => (
      <PieChart width={pieChartWidth} height={pieChartHeight}>
        <Pie
          paddingAngle={2}
          startAngle={startAngle}
          endAngle={endAngle}
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          activeIndex={activeIndices} // Set all indices to active so they can be custom rendered
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {pieData.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === activeIndex
                    ? getColorWithOpacity(
                        getSignerDistributionPieChartColor(
                          entry.name !== 'Other signer',
                          entry.value,
                          colorMode
                        ),
                        0.8
                      )
                    : getSignerDistributionPieChartColor(
                        entry.name !== 'Other signer',
                        entry.value,
                        colorMode
                      )
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {renderCenterCustomizedLabel({
          numSigners: signers.length,
          cx: pieChartWidth / 2,
          cy: pieChartHeight / 2,
        })}
      </PieChart>
    ),
    [pieData, activeIndices, colorMode, CustomTooltip, activeIndex, signers]
  );

  return <ClientOnly fallback={<PieChartSkeleton />}>{pieChart}</ClientOnly>;
}
