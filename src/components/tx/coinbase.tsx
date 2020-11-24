import * as React from 'react';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { CoinbaseTxs, TxData } from '@common/types/tx';
import { Block } from '@blockstack/stacks-blockchain-api-types';
import { PagePanes } from '@components/page-panes';
import { BtcAnchorBlockCard } from '@components/btc-anchor-card';

const CoinbasePage = ({ transaction, block }: TxData<CoinbaseTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <PagePanes fullWidth={transaction.tx_status === 'pending' || block === null}>
      <TransactionDetails transaction={transaction} />
      {block && <BtcAnchorBlockCard block={block} />}
    </PagePanes>
  </>
);

export default CoinbasePage;
