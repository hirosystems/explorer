import * as React from 'react';
import { Flex, Text, Box, Spinner, FlexProps } from '@stacks/ui';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon } from '@components/svg';

export type Statuses =
  | 'success'
  | 'pending'
  | 'failed' // todo: remove
  | 'abort_by_response'
  | 'abort_by_post_condition';

const colorMap = {
  pending: 'ink.600',
  success: '#008832',
  failed: '#D4001A',
  abort_by_response: '#D4001A',
  abort_by_post_condition: '#D4001A',
};

const labelMap = {
  pending: 'Pending',
  success: 'Success',
  failed: 'Failed',
  abort_by_response: 'Failed',
  abort_by_post_condition: 'Failed',
};

const SpinnerComponent = ({ color }: { color: string }) => (
  <Spinner color={color} speed="1s" thickness="2px" size="sm" />
);

const iconMap = {
  pending: SpinnerComponent,
  success: CheckmarkCircleIcon,
  failed: ExclamationMarkCircleIcon,
  abort_by_response: ExclamationMarkCircleIcon,
  abort_by_post_condition: ExclamationMarkCircleIcon,
};

interface StatusProps extends FlexProps {
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
