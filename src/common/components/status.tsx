'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { ReactNode } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { FlexProps } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
import { Spinner } from '../../ui/Spinner';
import { CheckIcon } from '../../ui/icons';
import { TxStatus } from '../types/tx';
import { Badge, BadgeProps } from './Badge';
import { LoaderQuarter } from './icons/loader-quarter';
import { MicroblockIcon } from './icons/microblock';

export const Pending = ({ speed = 0.9, ...p }: any) => <LoaderQuarter {...p} />;

const labelMap = {
  pending: 'In mempool',
  success: 'Confirmed',
  success_anchor_block: 'Confirmed in anchor block',
  success_microblock: 'Included in microblock',
  non_canonical: 'Non-canonical (orphaned)',
  failed: 'Failed',
  dropped: 'Dropped',
};

const iconMap = {
  pending: Spinner,
  success: CheckIcon,
  success_anchor_block: CheckIcon,
  success_microblock: () => <MicroblockIcon fill="white" />,
  non_canonical: HiOutlineExclamationCircle,
  failed: HiOutlineExclamationCircle,
  dropped: HiOutlineExclamationCircle,
};

interface StatusProps extends FlexProps {
  status: TxStatus;
}

export function StyledBadge({ children, ...rest }: { children: ReactNode } & BadgeProps) {
  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      bg={'purple.500'}
      color={'white'}
      gap={'4px'}
      border={'none'}
      flexShrink={'0'}
      {...rest}
    >
      {children}
    </Badge>
  );
}

export const TxStatusLabel: React.FC<StatusProps> = ({ status, ...rest }) => {
  const IconComponent = iconMap[status];
  const label = labelMap[status];
  return (
    <StyledBadge>
      <Icon as={IconComponent} size={3} />
      {label}
    </StyledBadge>
  );
};
