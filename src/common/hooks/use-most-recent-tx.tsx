import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { selectTransactionLastTxId } from '@store/transactions';

export const useMostRecentTxId = () => {
  const { mostRecentTxId } = useSelector((state: RootState) => ({
    mostRecentTxId: selectTransactionLastTxId(state),
  }));
  return mostRecentTxId;
};
