import React, { memo } from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { TxItem } from '@components/transaction-item';
import { TxLink } from '@components/links';
import { HoverableItem } from '@components/hoverable';

import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';

interface TransactionListItemProps extends BoxProps {
  tx: MempoolTransaction | Transaction;
  isLast?: boolean;
  principal?: string;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = memo(props => {
  const { tx, isLast, principal, ...rest } = props;
  return (
    <HoverableItem isLast={isLast}>
      <TxLink txid={tx.tx_id} {...rest}>
        <Box as="a" position="absolute" size="100%" />
      </TxLink>
      <TxItem as="span" tx={tx} principal={principal} key={tx.tx_id} />
    </HoverableItem>
  );
});
