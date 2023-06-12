'use client';

import { SkeletonBlockList } from '@/components/loaders/skeleton-text';
import { Section } from '@/components/section';
import dynamic from 'next/dynamic';
import React from 'react';
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
  ScriptableContext,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { Box } from '@/ui/Box';
import { colors } from '@/ui/theme/theme';
import { hexToRgba } from '@/app/common/utils/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      align: 'start' as const,
      backgroundColor: 'red',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const canvasId = 'monthly-active-developers-chart';

// const ctx =
//   typeof document !== 'undefined'
//     ? (document.getElementById(canvasId) as any)?.getContext('2d')
//     : null;
// const gradient = ctx && ctx.createLinearGradient(0, 0, 0, 400);
// if (gradient) {
//   gradient.addColorStop(0, hexToRgba(colors.brand.light, 0.3));
//   gradient.addColorStop(1, hexToRgba(colors.brand.light, 0));
// }

export const data = {
  labels,
  datasets: [
    {
      label: 'Monthly Active Developers',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: colors.brand.light,
      borderWidth: 1,
      backgroundColor: (context: ScriptableContext<'line'>) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, hexToRgba(colors.brand.light, 0.3));
        gradient.addColorStop(1, hexToRgba(colors.brand.light, 0));
        return gradient;
      },
      tension: 0.3,
      fill: true,
    },
  ],
};

const MonthlyActiveDevelopersChartSectionBase: React.FC = () => {
  return (
    <Section title="Monthly active developers" width={'100%'} headerProps={{ px: '24px' }}>
      <Box p={'24px'}>
        <Line options={options} data={data} id={canvasId} />
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
