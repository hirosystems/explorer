'use client';

import * as React from 'react';
import { TbClock } from 'react-icons/tb';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { Tooltip } from '../../ui/Tooltip';
import { toRelativeTime } from '../utils/utils';
import { Value } from './Value';

interface TimestampProps {
  ts: number;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts }) => {
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

  return (
    <Tooltip label={readableTimestamp}>
      <Flex alignItems="center">
        <Value suppressHydrationWarning={true}>{toRelativeTime(ts * 1000)}</Value>
      </Flex>
    </Tooltip>
  );
};
