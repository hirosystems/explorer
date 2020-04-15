import { useState, useEffect } from 'react';
import { store } from '@common/utils';
import { Transaction } from '@models/transaction.interface';
import { dedupe } from '@common/utils';

const storageKey = 'recentlyViewedTx';

type CachedTx = { viewedDate: string } & Transaction;

export const useRecentlyViewedTx = (transaction?: Transaction) => {
  if (!process.browser) return [];

  const storedTxs = store.get(storageKey, []);
  const [viewedTransactions, setViewedTransactions] = useState<Transaction[]>(storedTxs);

  useEffect(() => {
    if (transaction) {
      const newTx: CachedTx = { ...transaction, viewedDate: new Date().toISOString() };
      const cachedTxs = viewedTransactions.filter(({ tx_id }) => tx_id !== transaction.tx_id);
      const newTxList = dedupe([...cachedTxs, newTx], 'tx_id');
      setViewedTransactions(newTxList);
      store.set(storageKey, newTxList);
    }
  }, [transaction?.tx_id]);

  return Array.isArray(viewedTransactions) ? viewedTransactions : [];
};
