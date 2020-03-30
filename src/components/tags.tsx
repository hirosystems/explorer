import * as React from 'react';
import { FlexProps } from '@blockstack/ui';

import { Badge } from '@components/badge';
import { TransactionType } from '@models/transaction.interface';

const colorMap = {
  [TransactionType.SMART_CONTRACT]: '#0F5257',
  [TransactionType.CONTRACT_CALL]: '#F9A14D',
  [TransactionType.TOKEN_TRANSFER]: 'blue',
  [TransactionType.COINBASE]: '#6014B8',
  [TransactionType.POISON_MICROBLOCK]: '#AAA9DD',
};
const labelMap = {
  [TransactionType.SMART_CONTRACT]: 'Contract creation',
  [TransactionType.CONTRACT_CALL]: 'Contract call',
  [TransactionType.TOKEN_TRANSFER]: 'Token transfer',
  [TransactionType.COINBASE]: 'Coinbase',
  [TransactionType.POISON_MICROBLOCK]: 'Poison-microblock',
};

interface TagProps extends FlexProps {
  type: TransactionType;
}

export const Tag = ({ type, ...rest }: TagProps) => {
  return (
    <Badge background={colorMap[type]} {...rest}>
      {labelMap[type]}
    </Badge>
  );
};
