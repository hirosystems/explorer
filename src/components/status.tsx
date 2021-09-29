import * as React from 'react';

import { Box, FlexProps } from '@stacks/ui';

import { keyframes } from '@emotion/react';
import { css, Theme } from '@stacks/ui-core';
import { Badge } from './badge';

import { CheckIcon } from './icons/check';
import { LoaderQuarter } from './icons/loader-quarter';
import { AlertCircleIcon } from './icons/alert-circle';
import { MicroblockIcon } from './icons/microblock';
import { TxStatus } from '@common/types/tx';

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
`;

export const Pending = ({ speed = 0.9, ...p }: any) => (
  <LoaderQuarter
    css={(theme: Theme) =>
      css({
        animation: `${keyframesRotate} ${speed}s infinite linear`,
        color: 'currentColor',
      })(theme)
    }
    {...p}
  />
);

const labelMap = {
  pending: 'Pending',
  success: 'Confirmed',
  success_anchor_block: 'Confirmed in anchor block',
  success_microblock: 'Included in microblock',
  failed: 'Failed',
};

const iconMap = {
  pending: Pending,
  success: CheckIcon,
  success_anchor_block: CheckIcon,
  success_microblock: () => <MicroblockIcon fill="white" />,
  failed: AlertCircleIcon,
};

interface StatusProps extends FlexProps {
  txStatus: TxStatus;
}

export const Status: React.FC<StatusProps> = ({ txStatus, ...rest }) => {
  const IconComponent = iconMap[txStatus];
  const label = labelMap[txStatus];
  return (
    <Badge
      bg="rgba(255,255,255,0.24)"
      color="white"
      labelProps={{ display: 'flex', alignItems: 'center' }}
      maxHeight="24px"
      {...rest}
    >
      <IconComponent strokeWidth="2" size="16px" color="currentColor" />
      <Box ml="extra-tight">{label}</Box>
    </Badge>
  );
};
