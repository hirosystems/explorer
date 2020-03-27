import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

import { RootState } from '@store';
import { fetchTransactionDone, selectTransaction } from '@store/transactions';
import { ReduxNextPageContext } from '@common/types/next-store';
import { fetchTx } from '@common/api/transactions';
import { useRecentlyViewedTx } from '@common/hooks/use-recently-viewed-tx';

const TransactionPage = ({ txid }: { txid: string }) => {
  useRecentlyViewedTx(txid);

  const { transaction } = useSelector((state: RootState) => ({
    transaction: selectTransaction(state),
  }));

  const randomNum = Math.round(Math.random() * 1000000);

  return (
    <>
      <Link href="/">Home</Link>
      <h1>Transaction Page</h1>
      <code>
        <pre>{JSON.stringify(transaction, null, 2)}</pre>
      </code>
      <Link href="/txid/[txid]" as={`/txid/${randomNum}`}>
        <a>Next tx</a>
      </Link>
    </>
  );
};

TransactionPage.getInitialProps = async ({ store, query }: ReduxNextPageContext) => {
  const txid = query.txid.toString();
  const { transaction } = await fetchTx({ txid });
  store.dispatch(fetchTransactionDone(transaction));
  return { txid };
};

export default TransactionPage;
