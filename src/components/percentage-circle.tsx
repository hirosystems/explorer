import { Box, BoxProps } from '@/ui/components';
import * as React from 'react';

export const PercentageCircle: React.FC<BoxProps & { percentage: number }> = ({ percentage }) => {
  return (
    <Box strokeWidth={2} strokeLinecap="round" as="svg" viewBox="0 0 35 35">
      <Box
        as="path"
        fill="none"
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
        stroke="#444"
      />
      <text fontSize={'8'} x="10" y="20">
        {`${Math.round(percentage)}%`}
      </text>
    </Box>
  );
};
