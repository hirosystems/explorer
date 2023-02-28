import { Badge } from '@/common/components/Badge';
import { TxStatus } from '@/common/types/tx';
import { FlexProps, Icon, Spinner } from '@/ui/components';
import { CheckIcon } from '@/ui/icons';
import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

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
  txStatus: TxStatus;
}

export const Status: React.FC<StatusProps> = ({ txStatus, ...rest }) => {
  const IconComponent = iconMap[txStatus];
  const label = labelMap[txStatus];
  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      background={`bg.${useColorMode().colorMode}`}
      gap={'4px'}
      color="white"
      bg="rgba(255,255,255,0.24)"
      border={'none'}
      {...rest}
    >
      <Icon as={IconComponent} size="16px" color="currentColor" />
      {label}
    </Badge>
  );
};
