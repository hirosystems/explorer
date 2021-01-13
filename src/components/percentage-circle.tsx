import * as React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

export const PercentageCircle: React.FC<BoxProps & { percentage: number }> = ({
  percentage,
  strokeWidth = 5,
}) => {
  return (
    <Box strokeWidth={strokeWidth} strokeLinecap="round" as="svg" viewBox="0 0 36 36">
      <Box
        as="path"
        fill="none"
        stroke={color('border')}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <Box
        as="path"
        fill="none"
        stroke={color('brand')}
        strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </Box>
  );
};
