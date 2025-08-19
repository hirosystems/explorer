import { Box, ClientOnly } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip, TooltipProps } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { getColorWithOpacity } from '../../common/utils/color-utils';
import { useColorMode } from '../../components/ui/color-mode';
import { system } from '../../ui/theme/theme';
import { SignerLegendItem, removeStackingDaoFromName } from './SignerDistributionLegend';
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
    color = 'colors.orange.500';
  } else if (votingPowerPercentage >= 10 && votingPowerPercentage < 15) {
    color = 'colors.purple.500';
  } else if (votingPowerPercentage >= 15 && votingPowerPercentage < 20) {
    color = 'colors.green.500';
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
export const singersPieChartWidth = 220;
export const signersPieChartHeight = 220;

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

    const knownSignersAggregated = signers
      .filter(signer => getSignerKeyName(signer.signing_key) !== 'unknown')
      .map(signer => {
        let name = getSignerKeyName(signer.signing_key);
        let nameWithoutStackingDao = removeStackingDaoFromName(name);

        return {
          value: signer.weight_percent,
          name: nameWithoutStackingDao,
        };
      })
      .reduce(
        (acc, curr) => {
          const existingSigner = acc.find(s => s.name === curr.name);
          if (existingSigner) {
            existingSigner.value += curr.value;
            return acc;
          }
          return [...acc, curr];
        },
        [] as { name: string; value: number }[]
      )
      .filter(signer => signer.value > thresholdPercentage);

    const unknownSigners = signers.filter(
      signer => getSignerKeyName(signer.signing_key) === 'unknown'
    );
    const unknownSignersData =
      unknownSigners.length > 0
        ? [
            {
              name: 'Other signer',
              value: unknownSigners.reduce((acc, signer) => acc + signer.weight_percent, 0),
            },
          ]
        : [];

    let signersData = knownSignersAggregated;

    if (!onlyShowPublicSigners && unknownSignersData.length > 0) {
      signersData = signersData.concat(unknownSignersData);
    }

    return signersData.sort((a, b) => b.value - a.value);
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
      <PieChart width={singersPieChartWidth} height={signersPieChartHeight}>
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
          cx: singersPieChartWidth / 2,
          cy: signersPieChartHeight / 2,
        })}
      </PieChart>
    ),
    [pieData, activeIndices, colorMode, CustomTooltip, activeIndex, signers]
  );

  return <ClientOnly fallback={<PieChartSkeleton />}>{pieChart}</ClientOnly>;
}
