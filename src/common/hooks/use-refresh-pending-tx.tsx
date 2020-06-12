import { useCallback, useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { isPendingTx } from '@common/utils';
import { fetchTransaction } from '@store/transactions';
import { useDispatch } from '@common/hooks/use-dispatch';
import { useSandboxState } from '@common/hooks/use-sandbox-state';
import { useTransactionState } from '@common/hooks/use-transaction-state';

export const useRefreshPendingTx = (txid: string) => {
  const dispatch = useDispatch();
  const { transaction, loading, error } = useTransactionState(txid);
  const { identity, doFetchAccount } = useSandboxState();
  const [status, setStatus] = useState('pending');

  const REFRESH_DELAY = 5000;

  const noTx = !transaction;
  const needsToCheck = noTx || isPendingTx(transaction);

  const handleFetch = useCallback(async () => {
    if (error) return;
    if ((!loading && noTx) || isPendingTx(transaction)) {
      await dispatch(fetchTransaction(txid));
    }
  }, [txid, noTx, loading, error]);

  useInterval(handleFetch, !needsToCheck || error ? null : REFRESH_DELAY);

  useEffect(() => {
    if (!isPendingTx(transaction) && status === 'pending') {
      transaction && setStatus(transaction.tx_status);
      identity && doFetchAccount(identity.address);
    }
  }, [status, transaction]);
};
