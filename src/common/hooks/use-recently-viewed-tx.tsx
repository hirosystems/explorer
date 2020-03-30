import { useState, useEffect } from 'react';
import { store, dedupe } from '@common/utils';

const storageKey = 'recentlyViewedTx';

export const useRecentlyViewedTx = (txid?: string) => {
  if (!process.browser) return;

  const storedTxs = store.get(storageKey, []);
  const [viewedTransactions, setViewedTransactions] = useState(storedTxs);

  useEffect(() => {
    if (txid) {
      const newTxList = dedupe([...viewedTransactions, txid]);
      setViewedTransactions(newTxList);
      store.set(storageKey, newTxList);
    }
  }, [txid]);

  return viewedTransactions;
};
