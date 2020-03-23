import * as React from 'react';
import { FlexProps } from '@blockstack/ui';
import { Badge } from '@components/badge';

export enum Transaction {
  CONTRACT_CREATION = 'contact_creation',
  CONTRACT_CALL = 'contract_call',
  TOKEN_TRANSFER = 'token_transfer',
  COINBASE = 'coinbase',
  POISON_MICROBLOCK = 'poison_microblock',
}
const colorMap = {
  [Transaction.CONTRACT_CREATION]: '#0F5257',
  [Transaction.CONTRACT_CALL]: '#F9A14D',
  [Transaction.TOKEN_TRANSFER]: 'blue',
  [Transaction.COINBASE]: '#6014B8',
  [Transaction.POISON_MICROBLOCK]: '#AAA9DD',
};
const labelMap = {
  [Transaction.CONTRACT_CREATION]: 'Contract creation',
  [Transaction.CONTRACT_CALL]: 'Contract call',
  [Transaction.TOKEN_TRANSFER]: 'Token transfer',
  [Transaction.COINBASE]: 'Coinbase',
  [Transaction.POISON_MICROBLOCK]: 'Poison-microblock',
};

interface TagProps extends FlexProps {
  type: Transaction;
}

export const Tag = ({ type, ...rest }: TagProps) => {
  return (
    <Badge background={colorMap[type]} {...rest}>
      {labelMap[type]}
    </Badge>
  );
};
