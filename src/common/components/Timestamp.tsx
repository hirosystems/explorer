'use client';

import { extend } from 'dayjs';
import * as React from 'react';
import { TbClock } from 'react-icons/tb';

import { Box } from '../../ui/Box';
import { Flex } from '../../ui/Flex';
import { TextProps } from '../../ui/Text';
import { Tooltip } from '../../ui/Tooltip';
import { toRelativeTime } from '../utils/utils';
import { Value } from './Value';

interface TimestampProps extends TextProps {
  ts: number;
  showIcon?: boolean;
}

export function Timestamp({ ts, showIcon, ...rest }: TimestampProps) {
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

  return (
    <Tooltip label={readableTimestamp}>
      <Flex alignItems="center">
        {!!showIcon && <Box as={TbClock} size="16px" mr="4px" />}
        <Value suppressHydrationWarning={true} {...rest}>
          {toRelativeTime(ts * 1000)}
        </Value>
      </Flex>
    </Tooltip>
  );
}
