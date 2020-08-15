import { useSelector } from 'react-redux';
import { RootState } from '@store';
import {
  selectTransactionByIdOrContractName,
  selectTransactionLoading,
  selectTransactionError,
} from '@store/transactions';

export const useTransactionState = (txidOrContractName?: string) => {
  const { transaction, loading, error } = useSelector((state: RootState) => ({
    transaction: selectTransactionByIdOrContractName(txidOrContractName as string)(state),
    loading: selectTransactionLoading(state),
    error: selectTransactionError(state),
  }));
  return {
    transaction,
    loading,
    error,
  };
};
