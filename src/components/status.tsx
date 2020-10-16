import * as React from 'react';

import { Box, Flex, FlexProps, Spinner, Text } from '@stacks/ui';
import { CheckmarkCircleIcon, ExclamationMarkCircleIcon } from '@components/svg';

import { Badge } from './badge';
import { CheckIcon } from './icons/check';
import { border } from '@common/utils';
import { color } from '@components/color-modes';
import { LoaderQuarter } from './icons/loader-quarter';

import { keyframes } from '@emotion/react';
import { css, Theme } from '@stacks/ui-core';
import { AlertTriangleIcon } from './icons/alert-triangle';
import { AlertCircleIcon } from './icons/alert-circle';

const keyframesRotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(359deg);
  }
}`;

export type Statuses =
  | 'success'
  | 'pending'
  | 'failed' // todo: remove
  | 'abort_by_response'
  | 'abort_by_post_condition';

const colorMap = {
  pending: 'ink.900',
  success: '#008832',
  failed: '#D4001A',
  abort_by_response: '#D4001A',
  abort_by_post_condition: '#D4001A',
};

const labelMap = {
  pending: 'Pending',
  success: 'Confirmed',
  failed: 'Failed',
  abort_by_response: 'Failed',
  abort_by_post_condition: 'Failed',
};

const SpinnerComponent = ({ color }: { color: string }) => (
  <Spinner color={color} speed="1s" thickness="2px" size="sm" />
);

const iconMap = {
  pending: (p: any) => (
    <LoaderQuarter
      css={(theme: Theme) =>
        css({
          animation: `${keyframesRotate} 0.9s infinite linear`,
        })(theme)
      }
      {...p}
    />
  ),
  success: CheckIcon,
  failed: AlertCircleIcon,
  abort_by_response: AlertCircleIcon,
  abort_by_post_condition: AlertCircleIcon,
};

interface StatusProps extends FlexProps {
  status: Statuses;
}

export const Status: React.FC<StatusProps> = ({ status, ...rest }) => {
  const IconComponent = iconMap[status];
  const _color = colorMap[status];
  const label = labelMap[status];
  return (
    <Badge
      border={border()}
      bg={color('bg')}
      color={_color}
      labelProps={{ display: 'flex', alignItems: 'center' }}
      maxHeight="24px"
      {...rest}
    >
      <IconComponent strokeWidth="2" mr="extra-tight" size="16px" color={_color} />
      {label}
    </Badge>
  );
};
