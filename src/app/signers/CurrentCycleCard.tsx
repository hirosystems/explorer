'use client';

import { Box, ClientOnly, Flex, Stack } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, Sector, SectorProps } from 'recharts';

import { Card } from '../../common/components/Card';
import { useColorMode } from '../../components/ui/color-mode';
import { Text } from '../../ui/Text';
import { ExplorerErrorBoundary } from '../_components/ErrorBoundary';
import { useSuspenseCurrentStackingCycle } from '../_components/Stats/CurrentStackingCycle/useCurrentStackingCycle';
import { SignersStatsSectionSkeleton } from './skeleton';

export function CurrentCycleCardBase() {
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
        width={`${pieChartWidth}px`}
        height={`${pieChartHeight}px`}
        minWidth={`${pieChartWidth}px`}
        minHeight={`${pieChartHeight}px`}
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
                  key={`cell-${entry.name}`}
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
    <ClientOnly>
      <Card padding={6} height="100%" width="100%">
        <Flex mb={3}>
          <Box mr={4}>{pieChart}</Box>
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
    </ClientOnly>
  );
}

export function CurrentCycleCard() {
  return (
    <ExplorerErrorBoundary Wrapper={Card} tryAgainButton>
      <Suspense fallback={<SignersStatsSectionSkeleton />}>
        <CurrentCycleCardBase />
      </Suspense>
    </ExplorerErrorBoundary>
  );
}
