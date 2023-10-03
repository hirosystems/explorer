import { TbClock } from 'react-icons/tb';
import { toRelativeTime } from '@/common/utils';
import { Box, Flex, Tooltip } from '@/ui/components';

import { Value } from '../appPages/common/components/Value';

interface TimestampProps {
  ts: number;
}

export function Timestamp({ ts }: TimestampProps) {
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

  return (
    <Tooltip label={readableTimestamp}>
      <Flex alignItems="center">
        <Box as={TbClock} size="16px" mr="4px" />
        <Value>{toRelativeTime(ts * 1000)}</Value>
      </Flex>
    </Tooltip>
  );
}
