'use client';

import { Flex, FlexProps } from '../../ui/Flex';
import { Tooltip } from '../../ui/Tooltip';
import RelativeTimeDisplay from './RelativeTimeDisplay';
import { Value } from './Value';

interface TimestampProps {
  ts: number;
}

export function Timestamp({ ts, ...rest }: TimestampProps & FlexProps) {
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

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
