import * as React from 'react';
import * as timeago from 'timeago.js';
import { Flex, Text, FlexProps } from '@blockstack/ui';
import { ClockIcon } from '@components/svg';

interface TimestampProps extends FlexProps {
  ts: number;
}

/**
 * TODO: make this update if initial time is less than 1 min, so it will render each second out :)
 */
export const Timestamp: React.FC<TimestampProps> = ({ ts, ...props }) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCount(count + 1);
    }, 1000);

    return clearTimeout(timeout);
  }, [count]);
  return (
    <Flex align="center" {...props}>
      <ClockIcon mr="extra-tight" opacity={0.5} />
      <Text color="currentColor">{timeago.format(ts * 1000)}</Text>
    </Flex>
  );
};
