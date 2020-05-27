import { useEffect } from 'react';
import { store } from '@common/utils';
import { Transaction } from '@models/transaction.interface';
import { dedupe } from '@common/utils';

const storageKey = 'recentlyViewedTx';

type StoredTx = { viewedDate: string } & Transaction;

const handleRecentViewing = (txList: StoredTx[], transaction?: Transaction) => {
  if (!transaction) {
    return txList.sort((a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate));
  }

  const newTx: StoredTx = { ...transaction, viewedDate: new Date().toISOString() };
  const cachedTxs = transaction
    ? txList.filter(({ tx_id }) => tx_id !== transaction?.tx_id)
    : txList;
  const newTxList = dedupe([...cachedTxs, newTx], 'tx_id').sort(
    (a, b) => -(a as any).viewedDate.localeCompare((b as any).viewedDate)
  );
  store.set(storageKey, newTxList);
  return newTxList;
};

export const useRecentlyViewedTx = (transaction?: Transaction): StoredTx[] => {
  if (!process.browser) return [];

  let txList: StoredTx[] = store.get(storageKey, []);

  useEffect(() => {
    txList = handleRecentViewing(txList, transaction);
  }, [transaction?.tx_id]);

  return txList;
};
