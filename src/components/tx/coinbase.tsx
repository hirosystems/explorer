import * as React from 'react';
import { PageTop } from '@components/page';
import { TransactionType } from '@models/transaction.interface';
import { TransactionDetails } from '@components/transaction-details';
import { TxData } from '@common/types/tx';

const CoinbasePage = ({ transaction }: TxData) => (
  <>
    <PageTop status={transaction.tx_status} type={TransactionType.COINBASE} />
    <TransactionDetails transaction={transaction} />
  </>
);

export default CoinbasePage;
