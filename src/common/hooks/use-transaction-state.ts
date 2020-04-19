import { useSelector } from 'react-redux';
import { RootState } from '@store';
import {
  selectTransaction,
  selectTransactionLastTxId,
  selectTransactionLoading,
  selectTransactionError,
} from '@store/transactions';

export const useTransactionState = (specificTx?: string) => {
  let transaction = undefined;
  const { tx_id, loading, error } = useSelector((state: RootState) => ({
    tx_id: selectTransactionLastTxId(state),
    loading: selectTransactionLoading(state),
    error: selectTransactionError(state),
  }));

  if (specificTx) {
    transaction = useSelector((state: RootState) => ({
      transaction: selectTransaction(specificTx)(state),
    })).transaction;
  } else if (tx_id) {
    transaction = useSelector((state: RootState) => ({
      transaction: selectTransaction(tx_id)(state),
    })).transaction;
  }
  return {
    tx_id,
    transaction,
    loading,
    error,
  };
};
