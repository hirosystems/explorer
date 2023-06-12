'use client';

import { SkeletonBlockList } from '@/components/loaders/skeleton-text';
import { Section } from '@/components/section';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box } from '@/ui/Box';
import { colors } from '@/ui/theme/theme';
import { formatUTCDate } from '@/common/utils/formatUTCDate';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const canvasId = 'active-developers-chart';

const MonthlyActiveDevelopersChartSectionBase: React.FC<{
  controls: ReactNode;
  weeklyContributionData: { weekStartDateTs: string; numberOfContributors: number }[];
  period: number;
  windowSize: number;
}> = ({ weeklyContributionData, controls, period, windowSize }) => {
  if (!weeklyContributionData?.length) return null;

  const labels = weeklyContributionData
    .map(weekData => ({
      from: new Date(Number(weekData.weekStartDateTs) * 1000),
      to: new Date((Number(weekData.weekStartDateTs) + 6 * 24 * 60 * 60) * 1000),
    }))
    .slice(0, period || weeklyContributionData.length)
    .reverse();

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          callback: function (value: any) {
            return formatUTCDate(labels[value].to);
          },
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        align: 'start' as const,
        backgroundColor: 'red',
        labels: {
          padding: 20,
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function (tooltipItem: any) {
            return formatUTCDate(labels[tooltipItem[0].dataIndex].to);
          },
          labelPointStyle: function () {
            return {
              pointStyle: 'circle',
              rotation: 0,
              padding: 100,
            };
          },
        },
      },
    },
    animation: true,
  };

  const data = {
    labels,
    datasets: [
      {
        label: `${windowSize === 4 ? ' monthly' : ' weekly'} active developers`,
        data: weeklyContributionData
          .map(weekData => weekData.numberOfContributors)
          .slice(0, period || weeklyContributionData.length)
          .reverse(),
        borderColor: colors.brand.light,
        borderWidth: 1,
        backgroundColor: colors.brand.light,
        fill: true,
      },
    ],
  };
  return (
    <Section
      title={`${windowSize === 4 ? 'Monthly' : 'Weekly'} active developers`}
      width={'100%'}
      headerProps={{ px: '24px' }}
      topRight={() => controls}
    >
      <Box p={'24px'} height="500px">
        <Bar options={options as any} data={data} id={canvasId} />
      </Box>
    </Section>
  );
};

export default MonthlyActiveDevelopersChartSectionBase;

export const MonthlyActiveDevelopersChartSection = dynamic(
  () => import('./MonthlyActiveDevelopersChartSection'),
  {
    loading: () => <SkeletonBlockList />,
    ssr: false,
  }
);
