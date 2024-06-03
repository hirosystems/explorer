import {
  ColorMode,
  WithCSSVar,
  useBreakpointValue,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, TooltipProps } from 'recharts';
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

export function getSignerDistributionPieChartColor(
  votingPowerPercentage: number,
  colorMode: ColorMode
) {
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

function getSignerDistributionPieChartHex(
  votingPowerPercentage: number,
  colorMode: ColorMode,
  theme: WithCSSVar<Dict>
) {
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
  } else {
    return colorMode === 'light' ? theme.colors['slate'][250] : theme.colors['slate'][800];
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

// Function to calculate the label distance based on the angle
export const calculateLabelRadius = (radius: number, angle: number) => {
  const baseRadius = radius + 10;
  const maxOffset = 50;
  const angleMod = Math.abs(angle) % 360;

  let offset;
  if (angleMod >= 0 && angleMod < 90) {
    offset = (angleMod / 90) * maxOffset;
  } else if (angleMod >= 90 && angleMod < 180) {
    offset = ((180 - angleMod) / 90) * maxOffset;
  } else if (angleMod >= 180 && angleMod < 270) {
    offset = ((angleMod - 180) / 90) * maxOffset;
  } else {
    offset = ((360 - angleMod) / 90) * maxOffset;
  }

  return baseRadius + offset;
};

const startAngle = 0;
const endAngle = -(360 - startAngle);
const innerRadius = 40;
const outerRadius = 85;

type LabelData = {
  middleY: number;
  midAngle: number;
};

type Entries = [string, LabelData][];

function adjustLabelPositions(
  labelPositions: Record<string, { middleY: number; midAngle: number }>,
  cy: number,
  labelHeight: number
) {
  // Convert object to an array of [key, value] pairs
  let entries: Entries = Object.entries(labelPositions);

  // Split entries into quarters based on midAngle
  let quarters: Entries[] = [[], [], [], []];
  for (let [key, val] of entries) {
    const { midAngle } = val;
    const absMidAngle = Math.abs(midAngle);
    if (absMidAngle >= 0 && absMidAngle < 90) {
      quarters[0].push([key, val]);
    } else if (absMidAngle >= 90 && absMidAngle < 180) {
      quarters[1].push([key, val]);
    } else if (absMidAngle >= 180 && absMidAngle < 270) {
      quarters[2].push([key, val]);
    } else if (absMidAngle >= 270 && absMidAngle < 360) {
      quarters[3].push([key, val]);
    }
  }

  // Adjust label positions within each quarter
  for (let quarter of quarters) {
    // Sort entries based on midAngle
    quarter.sort((a, b) => a[1].midAngle - b[1].midAngle);

    for (let i = 0; i < quarter.length - 1; i++) {
      let [currentKey, currentVal] = quarter[i];
      let [nextKey, nextVal] = quarter[i + 1];

      // Check if the next value is too close to the current value
      if (Math.abs(currentVal.middleY - nextVal.middleY) < labelHeight) {
        if (nextVal.middleY > cy) {
          // Move the next label down
          quarter[i + 1][1].middleY = currentVal.middleY + labelHeight;
        } else {
          // Move the next label up
          quarter[i + 1][1].middleY = currentVal.middleY - labelHeight;
        }
      }
    }
  }

  // Merge the adjusted quarters back into a single object
  const adjustedEntries = quarters.flat();
  const result = Object.fromEntries(adjustedEntries);
  return result;
}

function addEllipsis(value: string, limit: number) {
  if (value.length < limit) return value;
  return `${value.substring(0, limit)}...`;
}

interface PieData {
  name: string;
  value: number;
  index: number;
}

interface SignersDistributionPieChartProps {
  signers: SignerInfo[];
  onlyShowPublicSigners: boolean;
}

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
    const knownSignersWithPercentageLessThanThreshold = signers
      .filter(
        signer =>
          getSignerKeyName(signer.signing_key) !== 'unknown' &&
          signer.weight_percent <= thresholdPercentage
      )
      .reduce((acc, signer) => acc + signer.weight_percent, 0);
    const unknownSignersPercentage = signers
      .filter(signer => getSignerKeyName(signer.signing_key) === 'unknown')
      .reduce((acc, signer) => acc + signer.weight_percent, 0);
    let signersData = knownSignersWithPercentageGreaterThanThreshold;
    if (knownSignersWithPercentageLessThanThreshold > thresholdPercentage) {
      signersData = signersData.concat({
        name: 'Others',
        value: knownSignersWithPercentageLessThanThreshold,
      });
    }
    if (!onlyShowPublicSigners) {
      signersData = signersData.concat({
        name: 'Private signers',
        value: unknownSignersPercentage,
      });
    }

    const signersDataWithIndex: PieData[] = signersData
      .map((signer, i) => {
        return { ...signer, index: i };
      })
      .sort((a, b) => b.value - a.value);

    return signersDataWithIndex;
  }, [signers, onlyShowPublicSigners]);
  const colorMode = useColorMode().colorMode;
  const theme = useTheme();

  const showLabels = useBreakpointValue({ sm: false, md: false, lg: false, xl: true, '2xl': true });
  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const labelPositions = useRef<Record<string, { middleY: number; midAngle: number }>>({});
  useEffect(() => {
    labelPositions.current = {};
  }, [onlyShowPublicSigners]);

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
      payload,
    }: PieSectorDataItem) => {
      // Calculate dynamic radii based on the value
      const smallestWidth = (outerRadius - innerRadius) / 1.5;
      const shrinkableWidth = outerRadius - innerRadius - smallestWidth;
      const shrinkFactor = shrinkableWidth / 7; // 7 is the number of ranges we have made
      const shrinkMultiple = getShrinkFactor(value);
      const shrinkValue = shrinkFactor * shrinkMultiple;
      const dynamicInnerRadius = innerRadius + shrinkValue;
      const dynamicOuterRadius = outerRadius - shrinkValue;
      const { index } = payload as unknown as PieData;

      const RADIAN = Math.PI / 180;
      const startX = (cx as number) + (dynamicOuterRadius + 5) * Math.cos(-midAngle * RADIAN);
      const startY = (cy as number) + (dynamicOuterRadius + 5) * Math.sin(-midAngle * RADIAN);
      const middleX =
        (cx as number) + ((outerRadius as number) + 10) * Math.cos(-midAngle * RADIAN);
      let middleY = (cy as number) + ((outerRadius as number) + 10) * Math.sin(-midAngle * RADIAN);

      const textSize = 14;
      const { width } = dimensions;
      const terminalX = middleX > cx ? cx + width / 2 : cx - width / 2;
      const text = `${addEllipsis(name || '', textSize)}`;
      const textWidth = textRefs.current[index]?.getBBox().width || 0;
      const endX = middleX > cx ? terminalX - textWidth : terminalX + textWidth;
      const textAnchor = middleX > (cx as number) ? 'start' : 'end';

      if (!((name as string) in labelPositions.current)) {
        labelPositions.current[name as string] = { middleY, midAngle };
      }
      const adjustedLabelPositions = adjustLabelPositions(labelPositions.current, cy, textSize);

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
              <line
                x1={startX}
                y1={startY}
                x2={middleX}
                y2={adjustedLabelPositions[name].middleY}
                stroke="var(--stacks-colors-borderPrimary)"
                strokeWidth={1}
              />
              <line
                x1={middleX}
                y1={adjustedLabelPositions[name].middleY}
                x2={endX}
                y2={adjustedLabelPositions[name].middleY}
                stroke="var(--stacks-colors-borderPrimary)"
                strokeWidth={1}
              />
              <text
                ref={el => (textRefs.current[index] = el)}
                x={endX}
                y={adjustedLabelPositions[name].middleY}
                fill="var(--stacks-colors-textSubdued)"
                fontStyle="Helvetica"
                textAnchor={textAnchor}
                dominantBaseline="central"
                fontSize={textSize}
              >
                {text}
              </text>
              <span className="Nick-Span" />
            </>
          ) : null}
        </g>
      );
    },
    [showLabels, dimensions]
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

  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const pieChart = useMemo(
    () => (
      <Box ref={containerRef} height="100%" width="100%">
        <ResponsiveContainer>
          <PieChart>
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
                            getSignerDistributionPieChartHex(entry.value, colorMode, theme),
                            0.8
                          )
                        : getSignerDistributionPieChartColor(entry.value, colorMode)
                    }
                    opacity={index === activeIndex ? 0.8 : 1}
                    strokeWidth={getSignerDistributionPieChartStrokeWidth(entry.value)}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    ),
    [pieData, renderActiveShape, activeIndices, colorMode, CustomTooltip, activeIndex, theme]
  );

  return pieChart;
}
