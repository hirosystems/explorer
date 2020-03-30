import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { RootState } from '@store';
import { fetchTransactionDone, fetchTransactionFailed, selectTransaction } from '@store/transactions';
import { ReduxNextPageContext } from '@common/types/next-store';
import { fetchTx } from '@common/api/transactions';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';
import { Transaction } from '@models/transaction.interface';

const TransactionPage = ({ tx_id }: Pick<Transaction, 'tx_id'>) => {
  const { transaction } = useSelector((state: RootState) => ({
    transaction: selectTransaction(tx_id)(state),
  }));

  useRecentlyViewedTx(transaction);

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Transaction Page</h1>
      <code>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </code>
    </>
  );
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const txid = query.txid.toString();
  try {
    const { transaction } = await fetchTx({ txid });
    store.dispatch(fetchTransactionDone(transaction));
  } catch (e) {
    store.dispatch(fetchTransactionFailed({ txid }));
  }
  return { tx_id: txid };
};

export default TransactionPage;
