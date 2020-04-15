import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectTransaction } from '@store/transactions';

export const useTransactionState = (tx_id: string) => {
    const { transaction } = useSelector((state: RootState) => ({
    transaction: selectTransaction(tx_id)(state),
  }));
    return transaction
}
