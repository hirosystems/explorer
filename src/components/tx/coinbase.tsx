import * as React from 'react';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { CoinbaseTxs, TxData } from '@common/types/tx';
import { Block } from '@stacks/stacks-blockchain-api-types';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { Events } from '@components/tx-events';
import { Box } from '@stacks/ui';

const CoinbasePage = ({ transaction, block }: TxData<CoinbaseTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
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

export default CoinbasePage;
