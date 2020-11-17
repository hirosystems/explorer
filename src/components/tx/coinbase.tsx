import * as React from 'react';
import { PageTop } from '@components/page';
import { TransactionDetails } from '@components/transaction-details';
import { CoinbaseTxs, TxData } from '@common/types/tx';
import { Block } from '@blockstack/stacks-blockchain-api-types';

const CoinbasePage = ({ transaction }: TxData<CoinbaseTxs> & { block?: Block }) => (
  <>
    <PageTop tx={transaction as any} />
    <TransactionDetails transaction={transaction} />
  </>
);

export default CoinbasePage;
