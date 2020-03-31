import * as React from 'react';
import { format } from 'timeago.js';
import { Flex, Text, FlexProps } from '@blockstack/ui';
import { ClockIcon } from '@components/svg';

interface TimestampProps extends FlexProps {
  ts: number;
}

/**
 * TODO: make this update if initial time is less than 1 min, so it will render each second out :)
 */
export const Timestamp: React.FC<TimestampProps> = ({ ts, ...props }) => {
  return (
    <Flex color="ink" align="center" {...props}>
      <ClockIcon mt="1px" mr="extra-tight" />
      <Text>{format(ts)}</Text>
    </Flex>
  );
};
