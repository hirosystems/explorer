import { Box, BoxProps } from '@/ui/components';
import * as React from 'react';

export const PercentageCircle: React.FC<BoxProps & { percentage: number }> = ({ percentage }) => {
  return (
    <Box strokeWidth={5} strokeLinecap="round" as="svg" viewBox="0 0 36 36">
      <Box
        as="path"
        fill="none"
        stroke={'border'}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <Box
        as="path"
        fill="none"
        stroke={'brand'}
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </Box>
  );
};
