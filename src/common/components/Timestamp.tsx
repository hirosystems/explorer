'use client';

import { Flex, FlexProps } from '../../ui/Flex';
import { Tooltip } from '../../ui/Tooltip';
import RelativeTimeDisplay from './RelativeTimeDisplay';
import { Value } from './Value';

interface TimestampProps {
  timestampInMs: number;
}

export function Timestamp({ timestampInMs: ts, ...rest }: TimestampProps & FlexProps) {
  const timeString = ts ? new Date(ts).toLocaleTimeString() : '';
  const dateString = ts ? new Date(ts).toLocaleDateString() : '';
  const readableTimestamp = ts ? `${timeString} ${dateString}` : '';

  return (
    <Tooltip label={readableTimestamp}>
      <Flex alignItems="center" {...rest}>
        <Value suppressHydrationWarning={true}>
          <RelativeTimeDisplay timestampInMs={ts} />
        </Value>
      </Flex>
    </Tooltip>
  );
}
