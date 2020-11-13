import * as React from 'react';
import { toRelativeTime, truncateMiddle } from '@common/utils';
import { Meta } from '@components/meta-head';

import { getTxTypeName } from '@common/transaction-names';

import type { Transaction, MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import type { TxData } from '@common/types/tx';

export const TransactionMeta: React.FC<Pick<
  TxData<Transaction | MempoolTransaction>,
  'transaction'
>> = ({ transaction }) => {
  const ogTitle = `${getTxTypeName(transaction.tx_type)}${
    transaction.tx_id && ` transaction: ${truncateMiddle(transaction.tx_id, 10)}`
  }`;
  const ogUrl = `/txid/${transaction.tx_id}`;
  const subject = transaction.sponsored ? 'Sponsored transaction' : 'Transaction';
  const ogDescription = `
    ${subject} initiated by ${transaction.sender_address}`;

  const labels =
    'burn_block_time' in transaction
      ? [
          {
            label: 'Confirmation',
            data: `${toRelativeTime(transaction?.burn_block_time * 1000)}, in block #${
              transaction.block_height
            }`,
          },
        ]
      : undefined;

  return (
    <Meta
      title={`${getTxTypeName(transaction.tx_type)} - Stacks 2.0 explorer`}
      ogTitle={ogTitle}
      description={ogDescription}
      url={ogUrl}
      status={transaction.tx_status}
      key={transaction.tx_status}
      labels={labels}
    />
  );
};
