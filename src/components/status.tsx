import * as React from 'react';
import { Flex, Text, Box, Spinner, BoxProps } from '@blockstack/ui';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon } from '@components/svg';

export enum Statuses {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

const colorMap = {
  [Statuses.PENDING]: 'ink.600',
  [Statuses.SUCCESS]: 'green',
  [Statuses.FAILED]: 'red',
};

const labelMap = {
  [Statuses.PENDING]: 'Pending',
  [Statuses.SUCCESS]: 'Success',
  [Statuses.FAILED]: 'Failed',
};

const iconMap = {
  [Statuses.PENDING]: ({ color }: { color: string }) => <Spinner color={color} speed="1s" thickness="2px" size="sm" />,
  [Statuses.SUCCESS]: CheckmarkCircleIcon,
  [Statuses.FAILED]: ExclamationMarkCircleIcon,
};

interface StatusProps extends BoxProps {
  status: Statuses;
}

export const Status: React.FC<StatusProps> = ({ status, ...rest }) => {
  const IconComponent = iconMap[status];
  const color = colorMap[status];
  const label = labelMap[status];
  return (
    <Flex align="center" {...rest}>
      <IconComponent color={color} />
      <Box ml="tight">
        <Text color={color} textStyle="body.small.medium" fontWeight="600">
          {label}
        </Text>
      </Box>
    </Flex>
  );
};
