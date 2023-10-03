import { useColorMode } from '@chakra-ui/react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';
import { Badge } from '@/common/components/Badge';
import { TransactionType } from '@/common/constants';
import { FlexProps, Icon } from '@/ui/components';

import { getTxTypeIcon } from './transaction-item';

export const transactionTypeColor = {
  [TransactionType.SMART_CONTRACT]: '#0F5257',
  [TransactionType.CONTRACT_CALL]: '#F9A14D',
  [TransactionType.TOKEN_TRANSFER]: '#F9A14D',
  [TransactionType.COINBASE]: '#6014B8',
  [TransactionType.POISON_MICROBLOCK]: '#AAA9DD',
};

const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
};

export interface TagProps extends FlexProps {
  type: Transaction['tx_type'];
  onClick?: any;
}

export const Tag = ({ type, ...rest }: TagProps) => {
  const TypeIcon = getTxTypeIcon(type);
  return (
    <Badge
      labelProps={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      background={`bg.${useColorMode().colorMode}`}
      color={`textBody.${useColorMode().colorMode}`}
      gap="4px"
      border="none"
      {...rest}
    >
      <Icon size="16px" color="currentColor" as={TypeIcon} />
      {txTypeNamesMap[type]}
    </Badge>
  );
};
