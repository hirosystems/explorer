import * as React from 'react';

import {
  Block,
  MempoolTokenTransferTransaction,
  TokenTransferTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Stack } from '@stacks/ui';

import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PageTop } from '@components/page';
import { PagePanes } from '@components/page-panes';
import { TransactionDetails } from '@components/transaction-details';
import { Events } from '@components/tx-events';

const TokenTransferPage: React.FC<{
  transaction: TokenTransferTransaction | MempoolTokenTransferTransaction;
  block?: Block;
}> = ({ transaction, block }) => {
  if (!transaction) return null;
  return (
    <>
      <PageTop tx={transaction as any} />
      <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
        <Stack spacing="extra-loose">
          <TransactionDetails transaction={transaction} block={block} hideContract />
          {'events' in transaction && (
            <Events
              txId={transaction.tx_id}
              events={transaction.events}
              event_count={transaction.event_count}
            />
          )}
        </Stack>
        {block && <BtcAnchorBlockCard block={block} />}
      </PagePanes>
    </>
  );
};

export default TokenTransferPage;
