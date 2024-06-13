import { ColorMode, WithCSSVar, useColorMode, useTheme } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, Tooltip, TooltipProps } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

import { Box } from '../../ui/Box';
import { SignerLegendItem } from './SignerDistributionLegend';
import { SignerInfo } from './data/useSigners';
import { getSignerKeyName } from './utils';

declare type Dict<T = any> = Record<string, T>;

export function getColorWithOpacity(color: string, opacity: number) {
  const rgb = hexToRgb(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '');

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

export function getSignerDistributionPieChartColor(
  isKnownSigner: boolean,
  votingPowerPercentage: number,
  colorMode: ColorMode
) {
  if (!isKnownSigner) {
    return colorMode === 'light'
      ? 'var(--stacks-colors-slate-250)'
      : 'var(--stacks-colors-slate-800)';
  }
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
  } else if (votingPowerPercentage >= 25) {
    return 'var(--stacks-colors-purple-800)';
  }
}

function getSignerDistributionPieChartHex(
  isKnownSigner: boolean,
  votingPowerPercentage: number,
  colorMode: ColorMode,
  theme: WithCSSVar<Dict>
) {
  if (!isKnownSigner) {
    return colorMode === 'light' ? theme.colors['slate'][250] : theme.colors['slate'][800];
  }
  if (votingPowerPercentage > 0 && votingPowerPercentage < 2) {
    return theme.colors['purple'][200];
  } else if (votingPowerPercentage >= 2 && votingPowerPercentage < 5) {
    return theme.colors['purple'][300];
  } else if (votingPowerPercentage >= 5 && votingPowerPercentage < 10) {
    return theme.colors['purple'][400];
  } else if (votingPowerPercentage >= 10 && votingPowerPercentage < 15) {
    return theme.colors['purple'][500];
  } else if (votingPowerPercentage >= 15 && votingPowerPercentage < 20) {
    return theme.colors['purple'][600];
  } else if (votingPowerPercentage >= 20 && votingPowerPercentage < 25) {
    return theme.colors['purple'][700];
  } else if (votingPowerPercentage >= 25) {
    return theme.colors['purple'][800];
  }
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
  signers: SignerInfo[];
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
          fill: 'var(--stacks-colors-textSubdued)',
          fontSize: 'var(--stacks-fontSizes-sm)',
          fontWeight: 'var(--stacks-fontWeights-sm)',
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
          fontSize: 'var(--stacks-fontSizes-2xl)',
          fontWeight: 'var(--stacks-fontWeights-medium)',
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
      }));
    const unknownSignersWithPercentageGreaterThanThreshold = signers
      .filter(
        signer =>
          getSignerKeyName(signer.signing_key) === 'unknown' &&
          signer.weight_percent > thresholdPercentage
      )
      .map(signer => ({
        name: 'Other signer',
        value: signer.weight_percent,
      }));

    let signersData = knownSignersWithPercentageGreaterThanThreshold;

    if (!onlyShowPublicSigners) {
      signersData = signersData.concat(unknownSignersWithPercentageGreaterThanThreshold);
    }

    return signersData;
  }, [signers, onlyShowPublicSigners]);
  const colorMode = useColorMode().colorMode;
  const theme = useTheme();

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
                        getSignerDistributionPieChartHex(
                          entry.name !== 'Other signer',
                          entry.value,
                          colorMode,
                          theme
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
    [pieData, activeIndices, colorMode, CustomTooltip, activeIndex, theme, signers]
  );

  return pieChart;
}
