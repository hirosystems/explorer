'use client';

import { useHomePageData } from '@/app/context';
import { useColorMode } from '@/components/ui/color-mode';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@/ui/Tabs';
import { Text } from '@/ui/Text';
import { Box, Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { ChartTooltip } from './ChartTooltip';
import {
  Chart,
  NetworkOverviewContextProvider,
  useNetworkOverviewContext,
} from './NetworkOverviewContextProvider';
import { SectionHeader } from './SectionHeader';

function NetworkOverviewChart() {
  const {
    initialRecentBlocks: { stxBlocksCountPerBtcBlock },
  } = useHomePageData();
  const { selectedChart, setSelectedChart } = useNetworkOverviewContext();
  const { colorMode } = useColorMode();

  const chartData = useMemo(() => {
    return stxBlocksCountPerBtcBlock.map(item => {
      const date = new Date(Number(item.burn_block_time) * 1000);

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const isPM = hours >= 12 && hours < 24;
      const displayHour = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const timeString = `${displayHour}:${formattedMinutes} ${isPM ? 'PM' : 'AM'}`;

      return {
        time: timeString,
        date: date,
        fullDate: date.toISOString(),
        blocksMined: item.stx_blocks_count,
        dailyTransactions: item.total_tx_count,
      };
    });
  }, [stxBlocksCountPerBtcBlock]);

  const getChartConfig = (chartType: Chart) => {
    const commonColors = {
      color:
        colorMode === 'light'
          ? 'var(--stacks-colors-accent-stacks-400)'
          : 'var(--stacks-colors-accent-stacks-500)',
      gradientStart:
        colorMode === 'light'
          ? 'var(--stacks-colors-accent-stacks-200)'
          : 'var(--stacks-colors-accent-stacks-700)',
      gradientEnd: colorMode === 'light' ? '#F3EFEC' : '#1C1815',
    };

    const configs = {
      [Chart.dailyTransactions]: {
        dataKey: 'dailyTransactions',
        ...commonColors,
        name: 'Transactions',
        valueFormatter: (value: number) => value.toLocaleString(),
        subtitle: chartData.reduce((sum, item) => sum + item.dailyTransactions, 0).toLocaleString(),
      },
      [Chart.blocksMined]: {
        dataKey: 'blocksMined',
        ...commonColors,
        name: 'Blocks',
        valueFormatter: (value: number) => value.toLocaleString(),
        subtitle: chartData.reduce((sum, item) => sum + item.blocksMined, 0).toLocaleString(),
      },
    };

    return configs[chartType];
  };

  const renderAreaChart = (chartType: Chart) => {
    const config = getChartConfig(chartType);
    const gradientId = 'chartGradient';
    const lineColor = 'var(--stacks-colors-redesign-border-secondary)';

    return (
      <Box height={48} width="100%">
        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
          <AreaChart
            data={chartData}
            key={`area-chart-${chartType}`}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.gradientStart} stopOpacity={0.8} />
                <stop offset="95%" stopColor={config.gradientEnd} stopOpacity={0.1} />
              </linearGradient>
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              horizontal={false}
              stroke={lineColor}
            />
            <XAxis
              dataKey="time"
              interval="preserveStartEnd"
              axisLine={{ stroke: lineColor }}
              tickLine={false}
              minTickGap={10}
              tick={{
                color: 'var(--stacks-colors-text-secondary)',
                fill: 'var(--stacks-colors-text-secondary)',
              }}
              style={{
                fontFamily: 'var(--font-matter-mono)',
                fontSize: 'var(--stacks-font-sizes-xs)',
              }}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--stacks-colors-redesign-border-secondary)', strokeWidth: 1 }}
            />
            <Area
              type="linear"
              dataKey={config.dataKey}
              name={config.name}
              stroke={config.color}
              strokeWidth={1}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              animationDuration={800}
              isAnimationActive={true}
              activeDot={{
                r: 7,
                fill: '#FC6432',
                stroke: colorMode === 'light' ? '#F8D3C3' : '#602B0D',
                strokeWidth: 4,
                strokeOpacity: 0.8,
                filter: 'url(#glow)',
              }}
              connectNulls={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <TabsRoot
      variant="primary"
      size="redesignMd"
      defaultValue={selectedChart}
      onValueChange={e => setSelectedChart(e.value as Chart)}
      gap={2}
      p={4}
      background={'surfaceSecondary'}
      borderRadius="redesign.xl"
    >
      <TabsList w="100%" flexWrap={'wrap'}>
        {Object.values(Chart).map(chartType => (
          <TabsTrigger
            key={chartType}
            value={chartType}
            flex="1"
            w="100%"
            maxW="100%"
            px={4}
            py={3}
            gap={2}
            flexDir={'column'}
            _hover={{ bg: chartType === selectedChart ? 'surfacePrimary' : 'surfaceSecondary' }}
            className="group"
          >
            <Text
              fontStyle="text-medium-sm"
              color={chartType === selectedChart ? 'textSecondary' : 'textTertiary'}
              w="100%"
              textAlign="left"
              _groupHover={{ color: 'textSecondary' }}
            >
              {chartType}
            </Text>
            <Text
              textStyle={'heading-sm'}
              color={chartType === selectedChart ? 'textPrimary' : 'textTertiary'}
              w="100%"
              textAlign="left"
              _groupHover={{ color: chartType === selectedChart ? 'textPrimary' : 'textSecondary' }}
            >
              {getChartConfig(chartType)?.subtitle}
            </Text>
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.values(Chart).map(chartType => (
        <TabsContent key={chartType} value={chartType} w="100%">
          {renderAreaChart(chartType)}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}

export function NetworkOverview() {
  return (
    <NetworkOverviewContextProvider>
      <Stack gap={4} flex={1}>
        <SectionHeader />
        <NetworkOverviewChart />
      </Stack>
    </NetworkOverviewContextProvider>
  );
}
