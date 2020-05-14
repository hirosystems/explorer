import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastType } from '@blockstack/ui';
import { doAddToast, doRemoveToast } from '@store/ui/actions';
import { RootState } from '@store';
import { selectToasts } from '@store/ui/selectors';

let toastCounter = 0;

export const useToast = () => {
  const dispatch = useDispatch();

  const addToast = useCallback(
    (toast: Omit<ToastType, 'id'>) =>
      dispatch(
        doAddToast({
          ...toast,
          id: `${toastCounter++}`,
        })
      ),
    []
  );

  const addCriticalToast = useCallback(
    (toast: Omit<ToastType, 'id' | 'tone'>) => addToast({ tone: 'critical', ...toast }),
    []
  );
  const addPositiveToast = useCallback(
    (toast: Omit<ToastType, 'id' | 'tone'>) => addToast({ tone: 'positive', ...toast }),
    []
  );

  const removeToast = useCallback((id: string) => {
    dispatch(doRemoveToast(id));
  }, []);

  const { toasts } = useSelector((state: RootState) => ({
    toasts: selectToasts(state),
  }));

  return {
    toasts,
    addToast,
    addCriticalToast,
    addPositiveToast,
    removeToast,
  };
};
