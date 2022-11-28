import * as React from 'react';

import { Box, Flex, FlexProps, Text, useClipboard } from '@stacks/ui';
import { IconClock } from '@tabler/icons';
import { Tooltip } from '@components/tooltip';
import { toRelativeTime } from '@common/utils';

interface TimestampProps extends FlexProps {
  ts: number;
  noTooltip?: boolean;
}

export const Timestamp: React.FC<TimestampProps> = ({ ts, noTooltip, ...props }) => {
  const [count, setCount] = React.useState(0);
  const readableTimestamp = ts
    ? `${new Date(ts * 1000).toLocaleTimeString()} ${new Date(ts * 1000).toLocaleDateString()}`
    : '';
  const { onCopy, hasCopied } = useClipboard(readableTimestamp);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return clearTimeout(timeout);
  }, [count]);

  const timestampElem = (
    <Flex alignItems="center" onClick={onCopy} {...props}>
      <Box as={IconClock} size="16px" mr="extra-tight" />
      <Text color="currentColor">{toRelativeTime(ts * 1000)}</Text>
    </Flex>
  );

  return noTooltip ? (
    timestampElem
  ) : (
    <Tooltip label={hasCopied ? 'Copied!' : readableTimestamp} placement={'right'}>
      {timestampElem}
    </Tooltip>
  );
};
