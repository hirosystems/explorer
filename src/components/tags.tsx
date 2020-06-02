import * as React from 'react';
import { FlexProps } from '@blockstack/ui';

import { Badge } from '@components/badge';
import { TransactionType } from '@models/transaction.interface';
import { getTxTypeName } from '@common/transaction-names';

export const transactionTypeColor = {
  [TransactionType.SMART_CONTRACT]: '#0F5257',
  [TransactionType.CONTRACT_CALL]: '#F9A14D',
  [TransactionType.TOKEN_TRANSFER]: 'blue',
  [TransactionType.COINBASE]: '#6014B8',
  [TransactionType.POISON_MICROBLOCK]: '#AAA9DD',
};

interface TagProps extends FlexProps {
  type: TransactionType;
}

export const Tag = ({ type, ...rest }: TagProps) => (
  <Badge background={transactionTypeColor[type]} {...rest}>
    {getTxTypeName(type)}
  </Badge>
);
