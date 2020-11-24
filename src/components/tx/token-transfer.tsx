import * as React from 'react';
import { Stack } from '@stacks/ui';

import { Events } from '@components/tx-events';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { TokenTransferTxs, TxData } from '@common/types/tx';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';
import { PagePanes } from '@components/page-panes';

const TokenTransferPage = ({
  transaction,
  block,
}: TxData<TokenTransferTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
      <Stack spacing="extra-loose">
        <TransactionDetails transaction={transaction} hideContract />
        {'events' in transaction && <Events events={transaction.events} />}
      </Stack>
      {block && <BtcAnchorBlockCard block={block} />}
    </PagePanes>
  </>
);

export default TokenTransferPage;
