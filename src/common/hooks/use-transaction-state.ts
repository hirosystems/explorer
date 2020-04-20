import { useSelector } from 'react-redux';
import { RootState } from '@store';
import {
  selectTransaction,
  selectTransactionLoading,
  selectTransactionError,
} from '@store/transactions';

export const useTransactionState = (tx_id: string) => {
  const { transaction, loading, error } = useSelector((state: RootState) => ({
    transaction: selectTransaction(tx_id)(state),
    loading: selectTransactionLoading(state),
    error: selectTransactionError(state),
  }));
  return {
    transaction,
    loading,
    error,
  };
};
