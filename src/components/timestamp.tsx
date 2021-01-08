import * as React from 'react';

import { Box, Flex, FlexProps, Text } from '@stacks/ui';
import { IconClock } from '@tabler/icons';
import { Tooltip } from '@components/tooltip';
import { toRelativeTime } from '@common/utils';

interface TimestampProps extends FlexProps {
  ts: number;
  noTooltip?: boolean;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts, noTooltip, ...props }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return clearTimeout(timeout);
  }, [count]);
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';

  const timestampElem = (
    <Flex alignItems="center" {...props}>
      <Box as={IconClock} size="16px" mr="extra-tight" />
      <Text color="currentColor">{toRelativeTime(ts * 1000)}</Text>
    </Flex>
  );

  return noTooltip ? (
    timestampElem
  ) : (
    <Tooltip label={readableTimestamp} placement={'right'}>
      {timestampElem}
    </Tooltip>
  );
};
