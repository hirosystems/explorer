import * as React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Flex, Text, FlexProps } from '@blockstack/ui';
import { ClockIcon } from '@components/svg';
import { Tooltip } from '@components/tooltip';

dayjs.extend(relativeTime);

interface TimestampProps extends FlexProps {
  ts: number;
  noTooltip?: boolean;
}

/**
 * TODO: make this update if initial time is less than 1 min, so it will render each second out :)
 */
export const Timestamp: React.FC<TimestampProps> = ({ ts, noTooltip, ...props }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return clearTimeout(timeout);
  }, [count]);
  const readableTimestamp = ts ? new Date(ts * 1000).toISOString() : '';
  const timestampElem = (
    <Flex align="center" {...props}>
      <ClockIcon mr="extra-tight" opacity={0.5} />
      <Text color="currentColor">{dayjs().to(ts * 1000)}</Text>
    </Flex>
  );

  return noTooltip ? (
    timestampElem
  ) : (
    <Tooltip label={readableTimestamp} hasArrow={false} placement={'right'}>
      {timestampElem}
    </Tooltip>
  );
};
