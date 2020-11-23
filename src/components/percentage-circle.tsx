import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { blue } from '@components/button';

export const PercentageCircle: React.FC<BoxProps & { percentage: number }> = ({ percentage }) => {
  return (
    <Box strokeWidth={5} strokeLinecap="round" as="svg" viewBox="0 0 36 36">
      <path
        fill="none"
        stroke={blue(0.1)}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        fill="none"
        stroke="blue"
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </Box>
  );
};
