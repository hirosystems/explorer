import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearContractsError } from '@store/contracts';
import { clearAccountError } from '@store/sandbox';
import { clearTransactionsError } from '@store/transactions';

export const useClearErrors = () => {
  const dispatch = useDispatch();

  const handleErrorClear = useCallback(() => {
    dispatch(clearTransactionsError());
    dispatch(clearAccountError());
    dispatch(clearContractsError());
  }, []);

  return handleErrorClear;
};
