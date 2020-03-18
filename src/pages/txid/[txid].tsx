import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '@store';
import { fetchTransactionDone, selectTransaction } from '@store/transactions';
import { ReduxNextPageContext } from '@common/types/next-store';
import { fetchTx } from '@common/api/transactions';

const TransactionPage = () => {
  const { transaction } = useSelector((state: RootState) => ({
    transaction: selectTransaction(state),
  }));

  return (
    <>
      <h1>Transaction Page</h1>
      <code>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </code>
    </>
  );
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const txid = query.txid.toString();
  const { transaction } = await fetchTx({ txid });
  store.dispatch(fetchTransactionDone(transaction));
};

export default TransactionPage;
