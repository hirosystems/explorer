import { useState, useEffect } from 'react';
import { store } from '@common/utils';
import { Transaction } from '@models/transaction.interface';

const storageKey = 'recentlyViewedTx';

interface CachedTx extends Transaction {
  viewedDate: string;
}

export const useRecentlyViewedTx = (transaction?: Transaction) => {
  if (!process.browser) return [];

  const storedTxs = store.get(storageKey, []);
  const [viewedTransactions, setViewedTransactions] = useState<Transaction[]>(storedTxs);

  useEffect(() => {
    if (transaction) {
      const newTx: CachedTx = { ...transaction, viewedDate: new Date().toISOString() };
      const cachedTxs = viewedTransactions.filter(({ tx_id }) => tx_id !== transaction.tx_id);
      const newTxList = [...cachedTxs, newTx];
      setViewedTransactions(newTxList);
      store.set(storageKey, newTxList);
    }
  }, [transaction?.tx_id]);

  return viewedTransactions;
};
