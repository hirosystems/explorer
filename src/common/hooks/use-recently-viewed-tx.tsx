import { useState, useEffect } from 'react';
import { store } from '@common/utils';

const storageKey = 'recentlyViewedTx';

export const useRecentlyViewedTx = (txid?: string) => {
  if (!process.browser) return;

  const storedTxs = store.get(storageKey, []);
  const [viewedTransactions, setViewedTransactions] = useState(storedTxs);

  useEffect(() => {
    if (txid) {
      const newTxList = [...viewedTransactions, txid];
      setViewedTransactions(newTxList);
      store.set(storageKey, newTxList);
    }
  }, [txid]);

  return viewedTransactions;
};
