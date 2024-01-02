'use client';

import { useColorMode } from '@chakra-ui/react';
import * as React from 'react';

import { Transaction } from '@stacks/stacks-blockchain-api-types';

import { FlexProps } from '../../ui/Flex';
import { Icon } from '../../ui/Icon';
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
      <Icon size={'12px'} color="currentColor" as={TypeIcon} />
      {txTypeNamesMap[type]}
    </StyledBadge>
  );
}
