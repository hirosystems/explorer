'use client';


import { Flex, FlexProps } from '../../ui/Flex';
import { Tooltip } from '../../ui/Tooltip';
import { toRelativeTime } from '../utils/utils';
import { Value } from './Value';

interface TimestampProps {
  ts: number;
}

export function  Timestamp({ ts, ...rest } : TimestampProps & FlexProps) {
  const readableTimestamp = ts 
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

  return (
    <Tooltip label={readableTimestamp}>
      <Flex alignItems="center" {...rest}>
        <Value suppressHydrationWarning={true}>{toRelativeTime(ts * 1000)}</Value>
      </Flex>
    </Tooltip>
  );
};
