'use client';

import { FlexProps, Icon } from '@chakra-ui/react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { TransactionType } from '../constants/constants';
import { getTxTypeIcon } from './TxIcon';
import { StyledBadge } from './status';

const txTypeNamesMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract deploy',
  [TransactionType.CONTRACT_CALL]: 'Function call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
  tenure_change: 'Tenure change',
};

export interface TagProps extends FlexProps {
  type: Transaction['tx_type'];
}

export function TxTypeTag({ type, ...rest }: TagProps) {
  const TypeIcon = getTxTypeIcon(type);
  return (
    <StyledBadge {...rest}>
      <Icon h={3} w={3} color="currentColor">
        {TypeIcon}
      </Icon>
      {txTypeNamesMap[type]}
    </StyledBadge>
  );
}
