import * as React from 'react';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { Events } from '@components/tx-events';
import { Box } from '@stacks/ui';
import {
  Block,
  CoinbaseTransaction,
  MempoolCoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

const CoinbasePage: React.FC<{
  transaction: CoinbaseTransaction | MempoolCoinbaseTransaction;
  block?: Block;
}> = ({ transaction, block }) => {
  if (!transaction) return null;
  return (
    <>
      <PageTop tx={transaction} />
      <PagePanes fullWidth={transaction.tx_status === 'pending' || !block}>
        <Box>
          <TransactionDetails transaction={transaction} />
          {'events' in transaction && (
            <Events txId={transaction.tx_id} mt="extra-loose" events={transaction.events} />
          )}
        </Box>
        {block && <BtcAnchorBlockCard block={block} />}
      </PagePanes>
    </>
  );
};

export default CoinbasePage;
